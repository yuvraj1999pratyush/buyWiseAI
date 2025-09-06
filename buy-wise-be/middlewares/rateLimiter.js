const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 10,
  message:
    "Request limit reached (10 requests per day). Please try again tomorrow.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => ipKeyGenerator(req, res),
});

const slowDownLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 2,
  message:
    "You can only make 2 requests every 10 seconds. Please wait before retrying.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => ipKeyGenerator(req, res),
});

module.exports = {
  dailyLimiter,
  slowDownLimiter,
};
