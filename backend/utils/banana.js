const axios = require("axios");

// Call Banana model API
async function callBananaModel(imagePath) {
  // Read image as base64
  const fs = require("fs");
  const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

  // Replace with your Banana API keys and model details
  const BANANA_API_KEY = process.env.BANANA_API_KEY;
  const BANANA_MODEL_KEY = process.env.BANANA_MODEL_KEY;

  const payload = {
    apiKey: BANANA_API_KEY,
    modelKey: BANANA_MODEL_KEY,
    input: {
      image: imageData,
    },
  };

  const response = await axios.post(
    "https://api.banana.dev/start/v4/",
    payload
  );
  return response.data;
}

module.exports = { callBananaModel };
