const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // Add more fields as needed (customization, AI data, etc.)
});

module.exports = mongoose.model("Image", imageSchema);
