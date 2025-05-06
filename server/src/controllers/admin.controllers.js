const { User } = require("../models/user.models");
const { Project } = require("../models/project.models");
const { Task } = require("../models/task.models");
const { asyncHandler } = require("../utils/asyncHandler.utils");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseHelper.utils");

module.exports = {
  // ✅ Remove user from a specific project only
  removeUser: asyncHandler(async (req, res, next) => {
    const { userId, projectId } = req.body;

    if (!userId || !projectId) {
      return errorResponse(res, 400, "User ID and Project ID are required.");
    }

    try {
      const project = await Project.findById(projectId);
      if (!project) return errorResponse(res, 404, "Project not found.");

      if (!project.members.includes(userId)) {
        return errorResponse(res, 400, "User is not a member of this project.");
      }

      // Remove user from project members
      project.members.pull(userId);
      await project.save();

      // Remove project from user's profile
      await User.findByIdAndUpdate(userId, {
        $pull: { projects: projectId },
      });

      // Get all tasks under this project
      const projectTasks = await Task.find({ projectId });

      // Extract IDs of those tasks
      const taskIds = projectTasks.map((task) => task._id);

      // Remove these task IDs from user's task list
      await User.findByIdAndUpdate(userId, {
        $pull: { tasks: { $in: taskIds } },
      });

      // Remove userId from assignedTo of all tasks in the project
      await Task.updateMany(
        { projectId, assignedTo: userId },
        { $pull: { assignedTo: userId } }
      );

      return successResponse(
        res,
        200,
        "User removed from project and all related task assignments."
      );
    } catch (err) {
      next(err);
    }
  }),

  // ✅ Ban user from the system entirely
  banUser: asyncHandler(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
      return errorResponse(res, 400, "User ID is required.");
    }

    try {
      const user = await User.findById(userId);
      if (!user) return errorResponse(res, 404, "User not found.");

      // Remove user from all projects
      await Project.updateMany(
        { members: userId },
        { $pull: { members: userId } }
      );

      // Unassign user from all tasks
      await Task.updateMany(
        { assignedTo: userId },
        { $unset: { assignedTo: "" } }
      );

      // Finally, delete user
      await user.deleteOne();

      return successResponse(res, 200, "User has been banned and removed.");
    } catch (err) {
      next(err);
    }
  }),

  promoteToAdmin: asyncHandler(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
      return errorResponse(res, 400, "User ID is required.");
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return errorResponse(res, 404, "User not found");
      }

      user.role = "admin";
      await user.save();

      return successResponse(res, 200, "User promoted to admin");
    } catch (err) {
      next(err);
    }
  }),
};
