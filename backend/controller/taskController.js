const { User } = require("../models/user");
const { Task } = require("../models/task");
const mongoose = require("mongoose");

const TaskController = module.exports;

// TODO : API to create task by assignee
TaskController.createTask = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Assignor does not exists" });
  }

  if (user.role !== "Assigner") {
    return res.status(400).json({
      message: "Invalid User Role, You cant create the Task",
      success: false,
    });
  }
  //userId
  const { title, description, priority, status, assignedWorker, isArchived } =
    req.body;
  // Validate required fields

  try {
    const createdTask = await Task.create({
      title,
      description,
      priority,
      status,
      isArchived,
      assignorId: userId,
      assignorEmail: user.email,
      assignorName: user.firstName,
    });

    await createdTask.save();
    // Create the task with the assignee's ID and email

    return res.status(200).json({
      message: "Task created Successfully",
      success: true,
      data: createdTask,
    });
  } catch (error) {
    console.error("Error Creating Task:", error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Failed to create Task",
      error: error.message,
    });
  }
};


//TODO : API to get all task's based on the login user's - if user is Assignee
TaskController.getAllTasks = async (req, res) => {
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
    if (user.role !== "Assigner") {
      return res.status(400).json({
        message: "Invalid User Role, You can't get the list of tasks",
        success: false,
      });
    }

    const tasks = await Task.find({ assignorId: userId })
      .populate("assigned_to_workers.workerId")
      .exec();

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

// TODO : API to create task by assignee
TaskController.assignTaskToWorker = async (req, res) => {
  const userId = req.user.id; // Assuming the user is authenticated and we get their ID from the token

  const { taskID, workerID } = req.body;

  try {
    // Check if the assignor (current user) exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Assignor does not exist",
      });
    }

    // Validate if the user is an "Assigner" (role validation)
    if (user.role !== "Assigner") {
      return res.status(400).json({
        success: false,
        message: "Invalid User Role, You can't assign the task",
      });
    }

    // Fetch the task by taskID
    const task = await Task.findById(taskID);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Validate if workerID is provided
    if (!workerID) {
      return res.status(400).json({
        success: false,
        message: "Worker ID is required",
      });
    }

    // Check if the worker exists in the User collection
    const worker = await User.findById(workerID);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Check if the worker is already assigned to this task
    const workerAlreadyAssigned = task.assigned_to_workers.some(
      (worker) => worker.workerId.toString() === workerID.toString()
    );

    if (workerAlreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Task is already assigned to this worker",
      });
    }

    // Add the worker to the task's assigned_to_workers array with default values
    task.assigned_to_workers.push({
      workerId: workerID,
      acknowledgedByWorker: false, // Initial status is false
      noteAddedByWorker: "", // No note initially
      status: "Backlog", // Default status
    });

    // Save the task after adding the worker
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task assigned successfully to worker",
      task, // Return the updated task object
    });
  } catch (error) {
    console.error("Error Assigning Task to Worker:", error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Error assigning Task to worker",
      error: error.message,
    });
  }
};

TaskController.getSingleTask = async (req, res) => {
  const { taskId } = req.params; // Extract the taskid from route parameters

  try {
    // Find the task by its ID
    const task = await Task.findById(taskId).populate("assigned_to_workers.workerId")
    .exec(); // Populate assignee data if needed

    // If no task found, return a 404 error
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Return the task data
    return res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the task",
      error: error.message,
    });
  }
};
