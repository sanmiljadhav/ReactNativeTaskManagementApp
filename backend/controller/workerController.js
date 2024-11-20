const { User } = require("../models/user");
const { Task } = require("../models/task");

const WorkerController = module.exports;

WorkerController.getAllWorkers = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists" });
    }

    if (user.role !== "Assigner") {
      return res.status(400).json({
        message: "Invalid User Role, You cant get the List of Workers",
        success: false,
      });
    }
    const workers = await User.find({ role: "Worker" }).select("-password");
    return res.status(200).json({
      message: "Workers fetched Successfully",
      success: true,
      workers: workers,
    });
  } catch (error) {
    console.error("Error fetching workers:", error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Failed to retrieve workers",
      error: error.message,
    });
  }
};

WorkerController.getTaskAssignedToWorker = async (req, res) => {
  try {
    const workerId = req.user.id;
    const worker = await User.findById(workerId);
    if (!worker) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists" });
    }


    if (worker.role !== "Worker") {
      return res.status(400).json({
        message: "Invalid User Role, You cant get the List of Tasks Assigned",
        success: false,
      });
    }

    const tasks = await Task.find({
      "assigned_to_workers.workerId": workerId,
      isArchived: false, // Exclude archived tasks (optional)
    }).populate("assigned_to_workers.workerId", "name email"); // Optionally populate worker details

    if (tasks.length === 0) {
      return res.status(404).json({ message: `No tasks assigned to you ${worker.email}` });
    }

    return res.status(200).json({
      message: "Tasks assigned to workers fetched successfully",
      success: true,
      tasks
    });
   
  } catch (error) {
    console.error("Error fetching workers:", error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Failed to get Tasks assigned to workers",
      error: error.message,
    });
  }
};


// API to acknowledge task by worker, add note, and update status
WorkerController.acknowledgeAndUpdateTask = async (req, res) => {
  const userId = req.user.id; // Assuming the user is authenticated and we get their ID from the token
  const { taskID, note, status } = req.body; // taskID, note, and status passed in the request body
  try {
    // Check if the user (worker) exists
    const worker = await User.findById(userId);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
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

    // Check if the worker is assigned to this task
    const workerAssignment = task.assigned_to_workers.find(
      (assignment) => assignment.workerId.toString() === userId.toString()
    );

    if (!workerAssignment) {
      return res.status(400).json({
        success: false,
        message: "You are not assigned to this task",
      });
    }

    // If the task is already acknowledged, no need to acknowledge again
    // if (workerAssignment.acknowledgedByWorker) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Task already acknowledged by this worker",
    //   });
    // }

    // Acknowledge the task by the worker
    workerAssignment.acknowledgedByWorker = true;

    // Update the note if provided
    if (note) {
      workerAssignment.noteAddedByWorker = note;
    }

    // Update the status if provided
    if (status && ["Done", "InProgress", "Backlog", "Archived"].includes(status)) {
      workerAssignment.status = status;
    }

    // Save the task after acknowledging and updating note/status
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task successfully acknowledged and updated by the worker",
      task, // Return the updated task object
    });
  } catch (error) {
    console.error("Error Acknowledging and Updating Task by Worker:", error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Error acknowledging and updating task by the worker",
      error: error.message,
    });
  }
};



