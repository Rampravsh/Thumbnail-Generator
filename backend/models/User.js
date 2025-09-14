const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
