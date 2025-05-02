const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/responseHelper.utils");

module.exports = {
  AuthenticateRequest: (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
      return errorResponse(res, 401, "Unauthorized");
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return errorResponse(res, 403, "Invalid or expired access token");
    }
  },
};
