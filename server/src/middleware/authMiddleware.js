import STATUS from "../constants/httpStatus.js";
import { sendError } from "../utils/response.js";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../config/jwt.js";

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return sendError(res, STATUS.FORBIDDEN, '需要身份验证的令牌');
    }
    token  = token.split(' ')[1]; 
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return sendError(res, STATUS.UNAUTHORIZED, '无效的令牌');
    }
}

export default verifyToken;