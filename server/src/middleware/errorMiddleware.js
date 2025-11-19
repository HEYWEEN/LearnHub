// src/middleware/errorHandler.js
import STATUS from "../constants/httpStatus.js";
import LOG_COLOR from "../constants/logColor.js";
import { sendError } from "../utils/response.js";
export function errorHandler(err, req, res, next) {
  const statusCode = err.status || STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || "服务器错误";
  if(statusCode===STATUS.INTERNAL_SERVER_ERROR){
    console.log(LOG_COLOR.FG_RED+"[err]","服务器内部错误: "+LOG_COLOR.RESET, {
      message:err.message,
      stack:err.stack,
      url:req.url,
      method:req.method,
      timestamp:new Date().toISOString()
    });
  }else{
    console.log(LOG_COLOR.FG_RED +'[err]'+LOG_COLOR.RESET+` ${statusCode}: ${message}`);
  }
  return sendError(
    res,
    message,
    statusCode
  );
}
export default errorHandler;
