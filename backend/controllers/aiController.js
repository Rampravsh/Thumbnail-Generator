const { GoogleGenerativeAI } = require("@google/generative-ai");
const { generateContentFromImageAndText } = require('../utils/banana');
const Image = require('../models/Image');

// Initialize the Google Generative AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};

const generateWithImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageFile = req.file;
    const user = req.user;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    if (!imageFile) {
      return res.status(400).json({ error: "Image is required" });
    }

    const { path: imagePath, mimetype, filename } = imageFile;

    // 1. Generate content with AI
    const resultText = await generateContentFromImageAndText(prompt, imagePath, mimetype);

    // 2. Save image to database (gallery)
    const image = await Image.create({
        user: user._id,
        filename: filename,
        path: imagePath,
        generatedText: resultText 
    });

    res.json({ 
      reply: resultText,
      image: {
        filename: image.filename,
        path: image.path,
        id: image._id,
      }
    });
  } catch (error) {
    console.error("Error in AI generation with image:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};

module.exports = { handleChat, generateWithImage };
