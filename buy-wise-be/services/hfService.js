const axios = require("axios");
const logger = require("../utils/logger");
require("dotenv").config();

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

async function generateAnswer(
  userMessages,
  model = "deepseek-ai/DeepSeek-V3.1:fireworks-ai"
) {
  logger.info(`[generateAnswer] Sending request to model: ${model}`);

  const systemMessage = {
    role: "system",
    content:
      "You are a helpful AI assistant. Answer the user questions clearly and concisely based on the provided product information. Do NOT repeat the question or the product information in your answer.",
  };

  const messages = [systemMessage, ...userMessages];

  try {
    const response = await axios.post(
      HF_API_URL,
      { model, messages },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    logger.info(`[generateAnswer] Response status: ${response.status}`);

    if (
      !response.data ||
      !response.data.choices ||
      !response.data.choices.length
    ) {
      throw {
        message: "No choices returned from Hugging Face API",
        slug: "hf_api_no_choices",
        statusCode: 502,
      };
    }

    const answer =
      response.data.choices[0].message.content || "No answer generated.";

    logger.info(`[generateAnswer] Generated answer: ${answer}`);

    return answer;
  } catch (error) {
    logger.error("[generateAnswer] API call failed:", error.message || error);
    throw {
      message: error.message || "Failed to get answer from Hugging Face API",
      slug: "hf_api_error",
      statusCode: 502,
    };
  }
}

module.exports = { generateAnswer };
