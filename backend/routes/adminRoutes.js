const express = require("express"); 
var router = express.Router(); 
 

const AdminController = require("../controller/adminContoller")
const AuthHelper = require("../helper/AuthHelper"); 

let validateToken = AuthHelper.validateToken; 

router.get("/tasks", validateToken, AdminController.getAllTasks);

module.exports = router; 