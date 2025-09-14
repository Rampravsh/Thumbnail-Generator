const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const Image = require("../models/Image");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to get user from JWT
async function getUserFromToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// POST /api/image/upload
router.post(
  "/upload",
  getUserFromToken,
  upload.single("image"),
  async (req, res) => {
    try {
      // Store image info in MongoDB
      const image = await Image.create({
        user: req.user._id,
        filename: req.file.filename,
        path: req.file.path,
      });

      // Integrate with banana model for AI processing
      const { callBananaModel } = require("../utils/banana");
      let bananaResult = null;
      try {
        bananaResult = await callBananaModel(req.file.path);
      } catch (bananaErr) {
        // Log or handle banana model error, but don't block upload
        bananaResult = {
          error: "Banana model failed",
          details: bananaErr.message,
        };
      }

      res.json({
        message: "Image uploaded successfully",
        filename: image.filename,
        path: image.path,
        id: image._id,
        bananaResult,
      });
    } catch (err) {
      res.status(500).json({ message: "Image upload failed" });
    }
  }
);

// GET /api/image/list - List all images for the authenticated user
router.get("/list", getUserFromToken, async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
});

// GET /api/image/file/:filename - Serve image file by filename
router.get("/file/:filename", async (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;
