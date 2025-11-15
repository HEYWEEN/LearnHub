// src/middleware/errorHandler.js

export function errorHandler(err, req, res, next) {
  console.error("服务器内部错误: ", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "服务器错误",
    data: null,
    code: err.status || 500,
  });
}
export default errorHandler;