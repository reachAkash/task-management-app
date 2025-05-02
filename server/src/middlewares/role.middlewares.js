const { errorResponse } = require("../utils/responseHelper.utils");

module.exports = {
  // Middleware to check if the user is an Admin
  isAdmin: (req, res, next) => {
    if (req.user.role !== "admin") {
      return errorResponse(
        res,
        403,
        "You don't have permission to perform this action."
      );
    }
    next();
  },

  // Middleware to check if the user is a Manager
  isManager: (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return errorResponse(
        res,
        403,
        "You don't have permission to perform this action."
      );
    }
    next();
  },
  // Custom check to see if the user is part of a project
  isProjectMember: (req, res, next) => {
    const projectId = req.params.projectId; // Assuming you're passing project ID in params
    if (!req.user.projects.includes(projectId)) {
      return errorResponse(res, 403, "You are not part of this project");
    }
    next();
  },

  // Check if the user is assigned a specific task
  isTaskAssigned: (req, res, next) => {
    const taskId = req.params.taskId; // Assuming task ID is passed in params
    if (!req.user.tasks.includes(taskId)) {
      return errorResponse(res, 403, "You are not assigned to this task");
    }
    next();
  },
};
