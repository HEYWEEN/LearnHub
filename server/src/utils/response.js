import STATUS from "../constants/httpStatus.js";
import LOG_COLOR from "../constants/logColor.js";
import { prettyJSON } from "./logUtils.js";

export function sendSuccess(res, message, data = null, code = STATUS.OK) {
  if (global.detailedLogging) {
    console.log(
      LOG_COLOR.FG_MAGENTA + "[res]" + LOG_COLOR.RESET,
      `Data: ${prettyJSON(data)}`
    );
  }
  return res.status(code).json({
    success: true,
    message,
    data,
    code,
  });
}

export function sendError(res, message, code = STATUS.INTERNAL_SERVER_ERROR) {
  return res.status(code).json({
    success: false,
    message,
    data: null,
    code,
  });
}
