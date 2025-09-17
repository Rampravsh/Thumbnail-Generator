require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const API_KEY = process.env.GOOGLE_API_KEY2;
const genAI = new GoogleGenerativeAI(API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

async function generateContentFromImageAndText(prompt, imagePath, mimeType) {
  const MAX_RETRIES = 3;
  let attempt = 0;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image-preview",
  });
  const imageParts = [fileToGenerativePart(imagePath, mimeType)];

  while (attempt < MAX_RETRIES) {
    try {
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      if (error.status === 429) {
        const isDailyQuota = error.errorDetails?.some((d) =>
          d.violations?.some((v) => v.quotaId?.includes("PerDay"))
        );

        if (isDailyQuota) {
          console.error("Daily quota exceeded:", error);
          throw new Error(
            "You have exceeded your daily API quota. Please try again tomorrow."
          );
        }

        if (attempt < MAX_RETRIES - 1) {
          attempt++;
          let retryDelay = 8000; // Default 8 seconds

          if (error.errorDetails) {
            const retryInfo = error.errorDetails.find(
              (d) => d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
            );
            if (retryInfo && retryInfo.retryDelay) {
              const delaySeconds = parseInt(
                retryInfo.retryDelay.replace("s", ""),
                10
              );
              if (!isNaN(delaySeconds)) {
                retryDelay = delaySeconds * 1000;
              }
            }
          }

          console.log(
            `Rate limit exceeded. Retrying in ${
              retryDelay / 1000
            } seconds... (Attempt ${attempt})`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue; // Retry the request
        }
      }

      // Handle other errors or the final failed retry
      console.error("Error generating content from image and text:", error);
      throw new Error(
        "The AI service is currently unavailable after multiple retries. Please try again later."
      );
    }
  }
}

module.exports = { generateContentFromImageAndText };
