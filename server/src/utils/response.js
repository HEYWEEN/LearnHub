export function sendSuccess(res, message, data = null, code = 200) {
  return res.status(code).json({
    success: true,
    message,
    data,
    code
  });
}

export function sendError(res, message, code = 500) {
  return res.status(code).json({
    success: false,
    message,
    data: null,
    code
  });
}