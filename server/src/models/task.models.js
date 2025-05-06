const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the users assigned to the task
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Reference to the project the task belongs to
      required: true,
    },
    status: {
      type: String,
      enum: ["not started", "in progress", "completed"],
      default: "not started",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "low",
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = { Task };
