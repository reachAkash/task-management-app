const { Project } = require("../models/project.models");
const { Task } = require("../models/task.models");
const { User } = require("../models/user.models");
const { asyncHandler } = require("../utils/asyncHandler.utils");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseHelper.utils");

module.exports = {
  getTasks: asyncHandler(async (req, res, next) => {
    const tasks = await Task.find({});
    return successResponse(res, 200, "Tasks fetched successfully", tasks);
  }),

  createTask: asyncHandler(async (req, res, next) => {
    const { title, description, projectId, priority = "low" } = req.body;

    if (!title || !description || !projectId) {
      return res
        .status(400)
        .json({ message: "Title, description, and projectId are required" });
    }

    const existingTask = await Task.findOne({ title, projectId });
    if (existingTask) {
      return errorResponse(res, 400, "Task already exists");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      priority,
    });

    project.tasks.push(task._id);
    await project.save();

    return successResponse(res, 201, "Task created successfully", task);
  }),

  getSingleTask: asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;
    if (!taskId) {
      return errorResponse(res, 404, "TaskId not found");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }

    return successResponse(res, 200, "Task fetched successfully", task);
  }),

  assignTask: asyncHandler(async (req, res, next) => {
    const { taskId, userId, projectId } = req.body;

    if (!taskId || !userId || !projectId) {
      return errorResponse(
        res,
        400,
        "Task ID, User ID, and Project ID are required"
      );
    }

    const project = await Project.findById(projectId);
    if (!project) return errorResponse(res, 404, "Project not found");

    const task = await Task.findById(taskId);
    if (!task) return errorResponse(res, 404, "Task not found");

    if (!project.members.includes(userId)) {
      return errorResponse(res, 403, "User is not part of the project");
    }

    if (task.assignedTo && task.assignedTo.toString() === userId) {
      return errorResponse(res, 400, "User already assigned to this task");
    }

    task.assignedTo = userId;
    await task.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { tasks: task._id },
    });

    return successResponse(res, 200, "Task assigned successfully", task);
  }),

  updateTask: asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;
    const { title, description, status, priority } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!title && !description && !status && !priority) {
      return errorResponse(res, 400, "No task fields provided to update.");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return errorResponse(res, 404, "Task not found.");
    }

    // Title or description update — only for manager or admin
    if ((title || description) && !["manager", "admin"].includes(userRole)) {
      return errorResponse(
        res,
        403,
        "Unauthorized to update title/description."
      );
    }

    // Status update — allowed for manager, admin, or assigned users
    const isAssigned = task.assignedTo && task.assignedTo.toString() === userId;

    if (status && !["manager", "admin"].includes(userRole) && !isAssigned) {
      return errorResponse(
        res,
        403,
        "You are not authorized to update task status."
      );
    }

    // Apply updates
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;

    await task.save();

    return successResponse(res, 200, "Task updated successfully.", task);
  }),

  deleteTask: asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;
    if (!taskId) {
      return errorResponse(res, 404, "TaskId not found");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }

    await Task.findByIdAndDelete(taskId);

    return successResponse(res, 200, "Task deleted successfully");
  }),
};
