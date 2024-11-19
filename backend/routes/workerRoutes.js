const express = require("express"); 
var router = express.Router();  

const WorkerController = require("../controller/workerController");
const AuthHelper = require("../helper/AuthHelper"); 

let validateToken = AuthHelper.validateToken; 

router.get("/worker", validateToken, WorkerController.getAllWorkers);
router.get("/worker/taskAssignedToWorker", validateToken, WorkerController.getTaskAssignedToWorker)
router.put("/worker/acknowledgeTask",validateToken,WorkerController.acknowledgeAndUpdateTask  )

module.exports = router; 