const express = require('express');
const router = express.Router();
const { handleChat, generateWithImage } = require('../controllers/aiController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });


const { getUserFromToken } = require("../middleware/auth");

// Define the chat route
// POST /api/ai/chat
router.post('/chat', handleChat);

// New route for image and text
router.post('/generate-with-image', getUserFromToken, upload.single('image'), generateWithImage);

module.exports = router;