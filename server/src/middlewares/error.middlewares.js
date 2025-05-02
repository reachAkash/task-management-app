const messageHelper = require("../utils/messageHelper.utils.js");
const { errorResponse } = require("../utils/responseHelper.utils.js");

module.exports = {
  customError: (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  },
  errorHandler: (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || messageHelper.INTERNAL_SERVER_ERROR;
    errorResponse(res, statusCode, message);
  },
};
