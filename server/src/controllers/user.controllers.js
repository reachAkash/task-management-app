const { User } = require("../models/user.models");
const { sendOTPEmail } = require("../utils/emailHelper.utils");
const jwt = require("jsonwebtoken");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseHelper.utils");
const { asyncHandler } = require("../utils/asyncHandler.utils");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {
  getUsers: asyncHandler(async (req, res, next) => {
    try {
      const users = await User.find({});
      return successResponse(res, 200, "Users fetched successfully", users);
    } catch (err) {
      next(err);
    }
  }),
  getSingleUser: asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).populate({
        path: "projects",
        populate: {
          path: "createdBy",
          model: "User",
          select: "name email role",
        },
      });


      if (!user) {
        return errorResponse(res, 404, "User not found");
      }

      const { password, refreshToken, otpExpiry, ...rest } = user._doc;

      return successResponse(res, 200, "User fetched successfully", rest);
    } catch (err) {
      next(err);
    }
  }),

  loginUser: asyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user || !(await user.isPasswordCorrect(password))) {
        return errorResponse(res, 401, "Invalid credentials");
      }

      // Send OTP again
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000;
      await user.save();

      await sendOTPEmail(email, otp);
      return successResponse(res, 200, "OTP sent to email");
    } catch (error) {
      next(error);
    }
  }),
  createUser: asyncHandler(async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return errorResponse(res, 400, "All fields are required");
      }

      if (!emailRegex.test(email)) {
        return errorResponse(res, 400, "Invalid email format");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return errorResponse(res, 400, "User already exists");
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser = await User.create({
        name,
        email,
        password,
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
      });

      await sendOTPEmail(email, otp);
      return successResponse(res, 200, "OTP sent to email");
    } catch (error) {
      next(error);
    }
  }),
  verifyOtp: asyncHandler(async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      // const user = await User.findOne({ email })
      const user = await User.findOne({ email })
        .populate("projects") // populates ProjectInterface[]
        .populate("tasks"); // populates TaskInterface[]
      if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        return errorResponse(res, 400, "Invalid or expired OTP");
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      user.refreshToken = refreshToken;
      await user.save();
      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

      const {
        password,
        otp: otpEx,
        otpExpiry,
        refreshToken: refreshTokenEx,
        ...rest
      } = user._doc;
      successResponse(res, 200, "User verified successfully", rest);
    } catch (error) {
      next(error);
    }
  }),
  refreshToken: asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== token) {
        return errorResponse(res, 403, "Invalid refresh token");
      }

      const newAccessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 3600000, // 1 hour
      });

      successResponse(res, 200, "New access token set in cookie");
    } catch (err) {
      return next(err);
    }
  }),
  logoutUser: asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", { httpOnly: true, secure: true });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    successResponse(res, 200, "Logged out successfully");
  }),
};
