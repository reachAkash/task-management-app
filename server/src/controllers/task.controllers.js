const { Project } = require("../models/project.models");
const { Task } = require("../models/task.models");
const { User } = require("../models/user.models");
const { use } = require("../routes/admin.routes");
const { asyncHandler } = require("../utils/asyncHandler.utils");
const { errorResponse } = require("../utils/responseHelper.utils");

module.exports = {
  createTask: asyncHandler(async (req, res) => {
    const { title, description, projectId } = req.body;

    if (!title || !description || !projectId) {
      return res
        .status(400)
        .json({ message: "Title, description, and projectId are required" });
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
  }),

  assignTasks: asyncHandler(async (req, res) => {
    try {
      const { taskId, userId, projectId } = req.body;

      // Check if the project exists
      const project = await Project.findById(projectId);
      if (!project) {
        return errorResponse(res, 404, "Project not found");
      }
      const existingTask = await Task.findById(taskId);
      if (!existingTask) {
        return errorResponse(res, 404, "Task not found");
      }

      // Check if the user is part of the project
      const isUserInProject = project.members.includes(userId); // Assuming project has a members field
      if (!isUserInProject) {
        return errorResponse(res, 403, "User is not part of the project");
      }

      // Assign the task
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      task.assignedTo = userId;
      await task.save();
      await User.findByIdAndUpdate(userId, {
        $push: { tasks: task._id },
      });

      return res
        .status(200)
        .json({ message: "Task assigned successfully", task });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }),
};
