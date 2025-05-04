const express = require("express");
const {
  AuthenticateRequest,
} = require("../middlewares/authenticate.middlewares");
const { isManager } = require("../middlewares/role.middlewares");
const {
  createProject,
  addUserToProject,
  updateProject,
  deleteProject,
  getProjects,
  getSingleProject,
} = require("../controllers/project.controllers");
const router = express.Router();

router.get("/", AuthenticateRequest, getProjects);
router.get("/:projectId", AuthenticateRequest, getSingleProject);
router.post("/add-user", AuthenticateRequest, isManager, addUserToProject);
router.post("/create", AuthenticateRequest, isManager, createProject);
router.put("/update/:projectId", AuthenticateRequest, isManager, updateProject);
router.delete(
  "/delete/:projectId",
  AuthenticateRequest,
  isManager,
  deleteProject
);

module.exports = router;
