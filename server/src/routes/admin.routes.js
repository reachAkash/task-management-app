const express = require("express");
const router = express.Router();
const { isAdmin, isManager } = require("../middlewares/role.middlewares.js");
const { createUser } = require("../controllers/user.controllers.js");
const {
  AuthenticateRequest,
} = require("../middlewares/authenticate.middlewares.js");
const {
  createProject,
  addUserToProject,
} = require("../controllers/project.controllers.js");
const {
  createTask,
  assignTasks,
} = require("../controllers/task.controllers.js");

router.post("/create-user", AuthenticateRequest, isAdmin, createUser);
router.post("/create-admin", createUser);
router.post(
  "/add-to-project",
  AuthenticateRequest,
  isManager,
  addUserToProject
);
router.post("/create-tasks", AuthenticateRequest, isManager, createTask);
router.post("/assign-tasks", AuthenticateRequest, isManager, assignTasks);
router.post("/create-project", AuthenticateRequest, isManager, createProject);
module.exports = router;
