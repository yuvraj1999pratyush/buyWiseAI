const { searchProducts } = require("../services/searchService");
const { generateAnswer } = require("../services/hfService");

async function askQuestion(req, res, next) {
  const { query } = req.body;
  if (!query) {
    return next({
      message: "Query is required",
      slug: "bad_request",
      statusCode: 400,
    });
  }

  try {
    const products = await searchProducts(query);

    let productInfo = "";
    products.forEach((p, i) => {
      productInfo += `${i + 1}. ${p.title} - ${p.description}\n`;
    });

    const messages = [
      {
        role: "user",
        content: `User Question: ${query}\nProduct info:\n${productInfo}\nBased on the above product information, answer the user's question clearly.`,
      },
    ];

    let answer = await generateAnswer(messages);

    const thinkTag = "</think>";
    const pos = answer.indexOf(thinkTag);
    if (pos !== -1) {
      answer = answer.substring(pos + thinkTag.length).trim();
    }

    res.json({ answer, products });
  } catch (error) {
    console.error("[askQuestion] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { askQuestion };
