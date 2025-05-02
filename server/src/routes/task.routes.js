const express = require("express");
const router = express.Router();
const { isManager } = require("../middleware/roleMiddleware");
const {
  AuthenticateRequest,
} = require("../middlewares/authenticate.middlewares");

router.post("/task/assign", AuthenticateRequest, isManager);
