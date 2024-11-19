const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Task title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Task description cannot exceed 500 characters"],
    },
    assignorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming a User model exists
      required: [true, "Owner ID is required"],
    },
    assignorName: {
      type: String,
      required: true,
      maxlength: 36,
    },
    assignorEmail: {
      type: String,
      required: [true, "Owner email is required"],
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    assigned_to_workers: [
      {
        workerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        acknowledgedByWorker: {
          type: Boolean,
          default: false, // Indicates if the worker has acknowledged the task
        },
        noteAddedByWorker: {
          type: String, // Notes added by the worker
          required: false,
        },
        status: {
          type: String,
          enum: ["Done", "InProgress", "Backlog", "Archived"],
          default: "Backlog",
          required: [true, "Status is required"],
        },
       
      },
    ]
    ,
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: [true, "Priority level is required"],
    },
   
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "task",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
const Task = mongoose.model("Task", TaskSchema);
module.exports = {
  Task,
};
