// src/middleware/notFound.js
import STATUS from "../constants/httpStatus.js";

export function notFound(req, res, next) {
  const err = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  err.status = STATUS.NOT_FOUND;
  next(err); //给errorHandler处理
}

export default notFound;
