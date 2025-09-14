// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// For authentication
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend port if different
    credentials: true,
  })
);

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
app.use("/api/auth", authRoutes);
app.use("/api/image", imageRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
