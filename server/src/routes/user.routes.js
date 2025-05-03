const express = require("express");
const router = express.Router();
const {
  loginUser,
  verifyOtp,
  refreshToken,
  logoutUser,
  getUsers,
  getSingleUser,
  createUser,
} = require("../controllers/user.controllers.js");
const {
  AuthenticateRequest,
} = require("../middlewares/authenticate.middlewares.js");

router.get("/", AuthenticateRequest, getUsers);
router.get("/:userId", AuthenticateRequest, getSingleUser);
router.post("/create-user", createUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/refresh-token", refreshToken);
router.get("/logout", logoutUser);
module.exports = router;
