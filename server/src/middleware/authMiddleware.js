import STATUS from "../constants/httpStatus.js";
import { sendError } from "../utils/response.js";
import jwt from 'jsonwebtoken';
import { getSecretKey } from "../config/jwt.js";

function verifyToken(req, res, next) {
    const SECRET_KEY = getSecretKey();
    let token = req.headers['authorization'];
    if (!token) {
        return sendError(res,'需要身份验证的令牌',STATUS.FORBIDDEN );
    }
    token  = token.split(' ')[1]; 
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return sendError(res,'无效的令牌',STATUS.UNAUTHORIZED);
    }
}

export default verifyToken;