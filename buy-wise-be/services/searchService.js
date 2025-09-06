const axios = require("axios");
const logger = require("../utils/logger");
require("dotenv").config();

const SEARCH_MICROSERVICE_URL = process.env.SEARCH_MICROSERVICE_URL;

async function searchProducts(query) {
  try {
    const response = await axios.post(SEARCH_MICROSERVICE_URL, { query });
    logger.info(
      `Search microservice responded with status: ${response.status}`
    );
    return response.data.results || [];
  } catch (error) {
    logger.error("Search service error:", error.message);
    throw {
      message: "Failed to retrieve products information",
      slug: "search_service_error",
      statusCode: 502,
    };
  }
}

module.exports = { searchProducts };
