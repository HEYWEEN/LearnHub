// src/middleware/errorHandler.js
import { sendError } from "../utils/response.js";
export function errorHandler(err, req, res, next) {
  console.error("服务器内部错误: ", err);
  return sendError(res, err.message || "服务器错误", err.status || 500);
}
export default errorHandler;