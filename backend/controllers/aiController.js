const { GoogleGenerativeAI } = require("@google/generative-ai");

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

module.exports = { handleChat };
