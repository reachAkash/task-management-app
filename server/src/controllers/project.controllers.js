const { Project } = require("../models/project.models"); // Assume project model exists
const { User } = require("../models/user.models");
const { asyncHandler } = require("../utils/asyncHandler.utils");
const { errorResponse } = require("../utils/responseHelper.utils");

module.exports = {
  createProject: asyncHandler(async (req, res, next) => {
    try {
      const { projectName, description } = req.body;

      if (!projectName || !description) {
        return errorResponse(
          res,
          400,
          "Project name and description are required"
        );
      }

      const existingProject = await Project.findOne({ name: projectName });

      if (existingProject) {
        return errorResponse(res, 400, "Project with this name already exists");
      }

      const newProject = await Project.create({
        name: projectName,
        description,
        members: [req.user._id], // Add the creator as the first member
        createdBy: req.user._id, // Track who created the project
      });

      await User.findByIdAndUpdate(req.user._id, {
        $push: { projects: newProject._id }, // Add the project to the user's projects
      });

      return res
        .status(201)
        .json({ message: "Project created successfully", project: newProject });
    } catch (error) {
      next(error);
    }
  }),

  addUserToProject: asyncHandler(async (req, res, next) => {
    try {
      const { userId, projectId } = req.body;
      const project = await Project.findById(projectId);
      const user = await User.findById(userId);

      if (!project || !user) {
        return errorResponse(res, 400, "Project or user not found");
      }

      if (project.members.includes(user._id)) {
        return errorResponse(res, 400, "User is already part of the project");
      }

      // Add the user to the project's `users` field (or whichever field stores project members)
      project.members.push(user._id);
      await project.save();

      // Add the project to the user's `projects` field
      user.projects.push(project._id);
      await user.save();

      return res
        .status(200)
        .json({ message: "User added to project successfully" });
    } catch (error) {
      next(error);
    }
  }),
};
