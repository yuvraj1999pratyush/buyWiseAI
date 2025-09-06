function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const slug = err.slug || "internal_server_error";
  const message = err.message || "An unexpected error occurred";

  console.error(`[${slug}] ${message}`, err);

  res.status(statusCode).json({
    error: {
      message,
      slug,
      statusCode,
    },
  });
}

module.exports = errorHandler;
