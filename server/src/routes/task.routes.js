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
} = require("../controllers/task.controllers");

router.post("/create-task", AuthenticateRequest, isManager, createTask);
router.post("/assign-task", AuthenticateRequest, isManager, assignTask);
router.put("/update/:taskId", AuthenticateRequest, updateTask);

module.exports = router;
