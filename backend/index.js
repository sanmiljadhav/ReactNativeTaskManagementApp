const express = require("express"); 
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const cors = require('cors');

const app = express(); 
const PORT = 3000; 


//middlewares
app.use(express.json())

// const mongoUrl = 'mongodb+srv://sanmiljadhav0402:chivu$10@cluster0.jexdh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
// mongoose.set("strictQuery", false); 

const mongoUrl = 'mongodb+srv://sanmiljadhav0402:chivu$10@cluster0.dsyxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(mongoUrl).then(()=>{
    console.log("Database connected Successfullyy")
}).catch(e => console.log(e))




const authRoutes = require("./routes/authRoutes"); 
const taskRoutes = require("./routes/taskRoutes")
const workerRoutes = require("./routes/workerRoutes"); 
const adminRoutes = require("./routes/adminRoutes");

// app.use(cors()); 
app.use(bodyParser.json()); 
app.use(cookieParser());  

app.use("/api/v1/user", authRoutes);
app.use("/api/v1", taskRoutes); 
app.use("/api/v1", workerRoutes);
app.use("/api/v1/admin",adminRoutes); 

app.listen(PORT,()=> console.log("Server is running on port : " + PORT)); 
module.exports = app;

