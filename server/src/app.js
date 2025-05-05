const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/error.middlewares.js");
const userRoutes = require("./routes/user.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const taskRoutes = require("./routes/task.routes.js");
const projectRoutes = require("./routes/project.routes.js");

// initial configurations
app.use(morgan("combined"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// api routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

// catching invalid routes
app.use((req, res, next) => {
  const url = req.originalUrl;
  return res.status(404).json({ message: `${url} is not a valid endpoint` });
});

// centralized error function
app.use(errorHandler);

module.exports = { app };
