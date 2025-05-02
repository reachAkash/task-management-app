const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  verifyOtp,
  refreshToken,
} = require("../controllers/user.controllers.js");
const {
  AuthenticateRequest,
} = require("../middlewares/authenticate.middlewares.js");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.get("/protected", AuthenticateRequest, (req, res) => {
  res.status(200).json({ message: "Protected route accessed", user: req.user });
});
router.post("/refresh-token", refreshToken);

module.exports = router;
