const { User } = require("../models/user");
const { Task } = require("../models/task");
const mongoose = require("mongoose");

const AdminController = module.exports;


//TODO : API to get all task's based on the login user's - if user is Assignee
AdminController.getAllTasks = async (req, res) => {
  try {
    // Extract userId from authenticated user
    const userId = req.user.id;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Check if the user has the correct role (e.g., "Assigner" role)
    if (user.role !== "Admin") {
      return res.status(400).json({
        message: "Invalid User Role, You can't get the list of tasks",
        success: false,
      });
    }

    const tasks = await Task.find().populate("assigned_to_workers.workerId").exec();
    // Return tasks in response
    return res.status(200).json({
      message: "Tasks fetched successfully",
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    console.error("Error occurred while retrieving tasks:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the tasks.",
      details: error.message, // Include the actual error message in the response
    });
  }
};

