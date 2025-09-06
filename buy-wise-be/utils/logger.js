const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg, obj) => {
    if (obj) {
      console.error(`[ERROR] ${msg}`, obj);
    } else {
      console.error(`[ERROR] ${msg}`);
    }
  },
};

module.exports = logger;
