const express = require("express"); 
var router = express.Router(); 
 
const TaskController = require("../controller/taskController"); 
const AuthHelper = require("../helper/AuthHelper"); 

let validateToken = AuthHelper.validateToken; 

router.post("/tasks", validateToken, TaskController.createTask); 
router.get("/tasks", validateToken, TaskController.getAllTasks);
router.put("/tasks",validateToken,TaskController.assignTaskToWorker)
router.get("/tasks/:taskId", validateToken, TaskController.getSingleTask)

module.exports = router; 