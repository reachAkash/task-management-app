const express = require("express");
const router = express.Router();
const {
  loginUser,
  verifyOtp,
  refreshToken,
  logoutUser,
} = require("../controllers/user.controllers.js");
const {
  AuthenticateRequest,
} = require("../middlewares/authenticate.middlewares.js");
const { User } = require("../models/user.models.js");
const { Project } = require("../models/project.models.js");

router.get("/get-users", async (req, res) => {
  const users = await User.find({});
  return res.status(200).json({ data: users });
});
router.post("/get-user", async (req, res) => {
  const { email } = req.body;
  const user = await User.find({ email });
  return res.status(200).json({ data: user });
});
router.get("/get-projects", async (req, res) => {
  const projects = await Project.find({});
  res.status(200).json(projects);
});
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.get("/protected", AuthenticateRequest, (req, res) => {
  res.status(200).json({ message: "Protected route accessed", user: req.user });
});
router.post("/refresh-token", refreshToken);
router.get("/logout", logoutUser);
module.exports = router;
