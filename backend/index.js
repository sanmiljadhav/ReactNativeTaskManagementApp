const express = require("express"); 
const mongoose = require('mongoose');
require('dotenv').config();  // Ensure dotenv is loaded at the start
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const cors = require('cors');

const app = express(); 
const PORT = process.env.PORT || 3000;  // Use the PORT from environment variable or default to 3000

//middlewares
app.use(express.json());

const mongoUrl = process.env.MONGO_URI;  // Use MONGO_URI from .env file
console.log("MONGO URL IS", mongoUrl)

mongoose.connect(mongoUrl)
  .then(() => {
      console.log("Database connected Successfully");
  })
  .catch(e => console.log(e));

const authRoutes = require("./routes/authRoutes"); 
const taskRoutes = require("./routes/taskRoutes");
const workerRoutes = require("./routes/workerRoutes"); 
const adminRoutes = require("./routes/adminRoutes");

// app.use(cors()); 
app.use(bodyParser.json()); 
app.use(cookieParser());  

app.use("/api/v1/user", authRoutes);
app.use("/api/v1", taskRoutes); 
app.use("/api/v1", workerRoutes);
app.use("/api/v1/admin", adminRoutes); 

app.listen(PORT, () => console.log("Server is running on port : " + PORT)); 

module.exports = app;
