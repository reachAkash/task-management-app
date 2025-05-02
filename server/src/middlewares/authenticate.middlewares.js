const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");
const { errorResponse } = require("../utils/responseHelper.utils");

module.exports = {
  AuthenticateRequest: async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
      return errorResponse(res, 401, "Unauthorized");
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decoded.userId);
      if (!user) {
        return errorResponse(res, 401, "User does not exist");
      }

      req.user = user;
      next();
    } catch (err) {
      return errorResponse(res, 403, "Invalid or expired access token");
    }
  },
};
