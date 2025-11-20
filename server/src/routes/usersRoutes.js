<<<<<<< HEAD
const express = require("express");
=======
import express from "express";
import { getProfile, updateProfile } from "../controllers/usersController.js";
import verifyToken from "../middleware/authMiddleware.js";
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
const router = express.Router();

//req
//请求头 Authorization: Bearer {token}
<<<<<<< HEAD
router.get("/profile", (req, res) => {
  res.json({
    success: true,
    data: {
      id: "user_123",
      username: "刘小峰",
      email: "xiaofengliu@example.com",
      avatar: "/avatars/avatar123.jpg",
      bio: "热爱学习的前端开发者",
    },
    code: 200,
  });
});
=======
router.get("/profile", getProfile);
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653

//req
//请求头 Authorization: Bearer {token}
//请求参数:
// {
//   "username": "string, 选填",
//   "avatar": "string, 选填, 头像URL",
//   "bio": "string, 选填, 个人简介"
// }
<<<<<<< HEAD
router.put("/profile", (req, res) => {
  res.json({
    success: true,
    message: "资料更新成功",
    data: {
      user: {
        id: "user_123",
        username: "石头",
        avatar: "/avatars/new_avatar.jpg",
        bio: "更新后的个人简介",
      },
    },
    code: 200,
  });
});

module.exports = router;
=======
router.put("/profile",verifyToken ,updateProfile);

export default router;
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
