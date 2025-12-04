import STATUS from "../constants/httpStatus.js";
import { sendError } from "../utils/response.js";
import jwt from "jsonwebtoken";
import { getSecretKey } from "../config/jwt.js";
import { prettyJSON } from "../utils/logUtils.js";
import LOG_COLOR from "../constants/logColor.js";

const verifyToken = (req, res, next) => {
  const SECRET_KEY = getSecretKey();
  let token = req.headers["authorization"];
  if (!token) {
    const err = new Error("需要身份验证的令牌");
    err.status = STATUS.FORBIDDEN;
    return next(err);
  }
  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (Err) {
    const err = new Error("令牌无效或过期");
    err.status = STATUS.UNAUTHORIZED;
    return next(err);
  }
};

const authorize = (roles = []) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
      let message = "权限不足\n";
      if (global.detailedLogging) {
        message += "当前用户"+prettyJSON(user);
      }
      const err = new Error(message);
      err.status = STATUS.FORBIDDEN;
      return next(err);
    }
    next();
  };
};

export { verifyToken, authorize };
