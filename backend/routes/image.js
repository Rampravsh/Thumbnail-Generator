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
const { getUserFromToken } = require("../middleware/auth");

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

      res.json({
        message: "Image uploaded successfully",
        filename: image.filename,
        path: image.path,
        id: image._id,
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

// GET /api/image/:id - Get image details by ID
router.get("/:id", getUserFromToken, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch image" });
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
