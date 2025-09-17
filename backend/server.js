// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cluster = require("cluster");
const os = require("os");
const process = require("process");
require("dotenv").config();

// For authentication
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors());

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello RPK!");
});
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/image");
const aiRoutes = require("./routes/ai"); // Add this line

app.use("/api/auth", authRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/ai", aiRoutes); // Add this line

// Start server
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);

  // Fork workers for each CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    // console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(port, () => {
    // console.log(`Worker ${process.pid} is running`);
    // console.log(`Server is running on port: ${port}`);
  });
}
