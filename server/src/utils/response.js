import STATUS from "../constants/httpStatus.js";

export function sendSuccess(res, message, data = null, code = STATUS.OK) {
  return res.status(code).json({
    success: true,
    message,
    data,
    code
  });
}

export function sendError(res, message, code = STATUS.INTERNAL_SERVER_ERROR) {
  return res.status(code).json({
    success: false,
    message,
    data: null,
    code
  });
}