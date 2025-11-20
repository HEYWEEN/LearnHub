import express from "express";
import { getProfile, updateProfile } from "../controllers/usersController.js";
import verifyToken from "../middleware/authMiddleware.js";
const router = express.Router();

//req
//请求头 Authorization: Bearer {token}
router.get("/profile", getProfile);

//req
//请求头 Authorization: Bearer {token}
//请求参数:
// {
//   "username": "string, 选填",
//   "avatar": "string, 选填, 头像URL",
//   "bio": "string, 选填, 个人简介"
// }
router.put("/profile",verifyToken ,updateProfile);

export default router;
