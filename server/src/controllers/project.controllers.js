const { Project } = require("../models/project.models"); // Assume project model exists
const { Task } = require("../models/task.models");
const { User } = require("../models/user.models");
const { asyncHandler } = require("../utils/asyncHandler.utils");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseHelper.utils");

module.exports = {
  getProjects: asyncHandler(async (req, res, next) => {
    try {
      const projects = await Project.find()
        .populate("members", "name email role") // optional: populate member details
        .populate("tasks", "title status assignedTo"); // optional: populate basic task info

      return successResponse(
        res,
        200,
        "Projects fetched successfully.",
        projects
      );
    } catch (err) {
      next(err);
    }
  }),
  getSingleProject: asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    if (!projectId) {
      return errorResponse(res, 404, "ProjectId not found");
    }
    try {
      const project = await Project.findById(projectId)
        .populate({
          path: "tasks",
          populate: {
            path: "assignedTo",
            model: "User",
            select: "-otp -otpExpire -refreshToken -password",
          },
        })
        .populate({
          path: "members",
          select: "-otp -otpExpire -refreshToken -password",
        })
        .populate({
          path: "createdBy",
          select: "-otp -otpExpire -refreshToken -password",
        });

      if (!project) {
        return errorResponse(res, 404, "Project not found");
      }

      return successResponse(res, 200, "Project fetched successfully", project);
    } catch (err) {
      next(err);
    }
  }),
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
        name: projectName.trim(),
        description: description.trim(),
        members: [req.user._id], // Add the creator as the first member
        createdBy: req.user._id, // Track who created the project
      });

      await User.findByIdAndUpdate(req.user._id, {
        $push: { projects: newProject._id }, // Add the project to the user's projects
      });

      return successResponse(
        res,
        201,
        "Project created successfully",
        newProject
      );
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

      return successResponse(res, 200, "User added to project successfully");
    } catch (error) {
      next(error);
    }
  }),

  updateProject: asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const { name, description } = req.body;

    if (!name && !description) {
      return errorResponse(res, 400, "No project fields provided to update.");
    }

    try {
      const project = await Project.findById(projectId);
      if (!project) {
        return errorResponse(res, 404, "Project not found.");
      }

      if (name) project.name = name;
      if (description) project.description = description;

      await project.save();

      return successResponse(
        res,
        200,
        "Project updated successfully.",
        project
      );
    } catch (err) {
      next(err);
    }
  }),

  deleteProject: asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    try {
      // Step 1: Find the project
      const project = await Project.findById(projectId);
      if (!project) {
        return errorResponse(res, 404, "Project not found.");
      }

      // Step 2: Get all task IDs related to this project
      const taskIds = await Task.find({ projectId }).distinct("_id");

      // Step 3: Delete all tasks related to the project
      await Task.deleteMany({ projectId });

      // Step 4: Remove those task references from all users
      await User.updateMany(
        { tasks: { $in: taskIds } },
        { $pull: { tasks: { $in: taskIds } } }
      );

      // Step 5: Remove this project from users' project lists
      await User.updateMany(
        { projects: projectId },
        { $pull: { projects: projectId } }
      );

      // Step 6: Delete the project itself
      await Project.findByIdAndDelete(projectId);
      // task => 6814ba0d3cfcc5987d9620a1

      return successResponse(
        res,
        200,
        "Project and its tasks deleted successfully."
      );
    } catch (err) {
      next(err);
    }
  }),
};
