import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function askQuestion(query) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/ask`,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.error?.message || "API request failed"
      );
    } else {
      throw new Error(error.message || "Network error");
    }
  }
}
