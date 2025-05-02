const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/error.middlewares.js");
const userRoutes = require("./routes/user.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

// initial configurations
app.use(morgan("combined"));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// api routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// catching invalid routes
app.use((req, res, next) => {
  const url = req.originalUrl;
  return res.status(404).json({ message: `${url} is not a valid endpoint` });
});

// centralized error function
app.use(errorHandler);

module.exports = { app };
