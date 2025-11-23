import express from "express";
const router = express.Router();


import verifyToken from "../middleware/authMiddleware.js";
import { getMe, login, refreshToken, register } from "../controllers/authController.js";

//req 
//请求头 Authorization: Bearer {token}
router.get("/me",verifyToken, getMe);

//req 
//请求参数:
// {
//   "email": "string, 必填",
//   "password": "string, 必填"
// }
router.post("/login", login);

//req
//请求参数:
// {
//   "username": "string, 必填, 3-20位字符",
//   "email": "string, 必填, 有效邮箱格式",
//   "password": "string, 必填, 最少6位",
//   "role": "string, 选填, student/teacher, 默认student"
// }
router.post("/register", register);

router.get("/refresh",verifyToken,refreshToken);

export default router;
