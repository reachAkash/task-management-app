const { Project } = require("../models/project.models");
const { Task } = require("../models/task.models");
const { User } = require("../models/user.models");
const { use } = require("../routes/admin.routes");
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
    const { title, description, projectId } = req.body;

    if (!title || !description || !projectId) {
      return res
        .status(400)
        .json({ message: "Title, description, and projectId are required" });
    }

    try {
      const existingTask = await Task.findOne({ title, projectId });

      if (existingTask) {
        return errorResponse(res, 400, "Task already exists");
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const task = await Task.create({
        title,
        description,
        projectId,
      });

      project.tasks.push(task._id);
      await project.save();

      res.status(201).json({ message: "Task created successfully", task });
    } catch (err) {
      return next(err);
    }
  }),

  getSingleTask: asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;
    if (!taskId) {
      return errorResponse(res, 404, "TaskId not found");
    }
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return errorResponse(res, 404, "Task not found");
      }
      return successResponse(res, 200, "Task fetched successfully", task);
    } catch (err) {
      next(err);
    }
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

    try {
      // Validate project
      const project = await Project.findById(projectId);
      if (!project) {
        return errorResponse(res, 404, "Project not found");
      }

      // Validate task
      const task = await Task.findById(taskId);
      if (!task) {
        return errorResponse(res, 404, "Task not found");
      }

      // Check if user is a member of the project
      if (!project.members.includes(userId)) {
        return errorResponse(res, 403, "User is not part of the project");
      }

      // Check if user is already assigned
      if (task.assignedTo.includes(userId)) {
        return errorResponse(res, 400, "User already assigned to this task");
      }

      // Add user to task's assignedTo array
      task.assignedTo.push(userId);
      await task.save();

      // Add task to user's tasks array if not already there
      await User.findByIdAndUpdate(userId, {
        $addToSet: { tasks: task._id },
      });

      return successResponse(res, 200, "Task assigned successfully", task);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }),

  updateTask: asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!title && !description && !status) {
      return errorResponse(res, 400, "No task fields provided to update.");
    }

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return errorResponse(res, 404, "Task not found.");
      }

      // Title or description update — only for manager or admin
      if ((title || description) && !["manager", "admin"].includes(userRole)) {
        return errorResponse(res, 403, "Unauthorized");
      }

      // Status update — allowed for manager, admin, or assigned users
      const isAssigned = task.assignedTo.some(
        (assignedUser) => assignedUser.toString() === userId
      );

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

      await task.save();

      return successResponse(res, 200, "Task updated successfully.", task);
    } catch (err) {
      return next(err);
    }
  }),
  deleteTask: asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;
    if (!taskId) {
      return errorResponse(res, 404, "TaskId not found");
    }
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return errorResponse(res, 404, "Task not found");
      }
      await Task.findByIdAndDelete(taskId);
      return successResponse(res, 200, "Task deleted successfully");
    } catch (err) {
      next(err);
    }
  }),
};
