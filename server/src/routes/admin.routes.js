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
const {} = require("../controllers/task.controllers.js");
const { banUser, removeUser } = require("../controllers/admin.controllers.js");

router.post("/create-user", AuthenticateRequest, isAdmin, createUser);
router.post("/create-admin", createUser);
router.post(
  "/add-to-project",
  AuthenticateRequest,
  isManager,
  addUserToProject
);
router.post("/create-project", AuthenticateRequest, isManager, createProject);
router.post("/remove-user", AuthenticateRequest, isAdmin, removeUser);
router.post("/ban-user", AuthenticateRequest, isAdmin, banUser);
module.exports = router;
