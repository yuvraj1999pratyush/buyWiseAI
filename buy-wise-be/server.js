require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { askQuestion } = require("./controllers/chatController");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const { dailyLimiter, slowDownLimiter } = require("./middlewares/rateLimiter");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/ask", dailyLimiter, slowDownLimiter);

app.post("/ask", askQuestion);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
