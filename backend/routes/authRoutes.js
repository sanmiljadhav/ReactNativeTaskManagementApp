const express = require("express"); 
const router = express.Router(); 
 

const AuthController = require("../controller/auth"); 

console.log("In auth routes BE")

router.post("/signUp", AuthController.signUp);
router.post("/signIn", AuthController.SignIn) 
// router.post("/signIn", AuthController.SignIn); 

module.exports = router
