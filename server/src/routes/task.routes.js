const express = require("express");
const router = express.Router();
const { isManager } = require("../middlewares/role.middlewares.js");
const {
  AuthenticateRequest,
} = require("../middlewares/authenticate.middlewares");
const {
  createTask,
  assignTask,
  updateTask,
  deleteTask,
  getTasks,
  getSingleTask,
} = require("../controllers/task.controllers");

router.get("/", AuthenticateRequest, getTasks);
router.get("/:taskId", AuthenticateRequest, getSingleTask);
router.post("/create-task", AuthenticateRequest, isManager, createTask);
router.post("/assign-task", AuthenticateRequest, isManager, assignTask);
router.put("/update/:taskId", AuthenticateRequest, updateTask);
router.delete("/:taskId", AuthenticateRequest, deleteTask);

module.exports = router;
