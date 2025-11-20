<<<<<<< HEAD
const express = require("express");
const router = express.Router();


//req 
//请求头 Authorization: Bearer {token}
router.get("/me", (req, res) => {
  res.json({
    success: true,
    data: {
      id: "user_123",
      username: "刘小峰",
      email: "xiaofengliu@smail.nju.edu.cn",
      role: "student",
      avatar: "/avatars/default.jpg",
      createdAt: "2024-01-15T10:30:00Z",
    },
    code: 200,
  });
});
=======
import express from "express";
const router = express.Router();

import { getMe, login, register } from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

//req 
//请求头 Authorization: Bearer {token}
router.get("/me",verifyToken, getMe);
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653

//req 
//请求参数:
// {
//   "email": "string, 必填",
//   "password": "string, 必填"
// }
<<<<<<< HEAD
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Add authentication logic here
  res.json({
    success: true,
    message: "登录成功",
    data: {
      user: {
        id: "user_123",
        username: "刘小峰",
        email: "xiaofengliu@smail.nju.edu.cn",
        role: "student",
        avatar: "/avatars/default.jpg",
      },
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
    code: 200,
  });
});
=======
router.post("/login", login);
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653

//req
//请求参数:
// {
//   "username": "string, 必填, 3-20位字符",
//   "email": "string, 必填, 有效邮箱格式",
//   "password": "string, 必填, 最少6位",
//   "role": "string, 选填, student/teacher, 默认student"
// }
<<<<<<< HEAD
router.post("/register", (req, res) => {
  res.json({
    success: true,
    message: "注册成功",
    data: {
      user: {
        id: "user_123",
        username: "刘小峰",
        email: "xiaofengliu@smail.nju.edu.cn",
        role: "student",
        createdAt: "2025-1-11T11:11:11Z",
      },
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
    code: 200,
  });
  // 模拟邮箱已被注册的情况
  //   res.json({
  //     success: false,
  //     message: "邮箱已被注册",
  //     data: null,
  //     code: 400,
  //   });
});

module.exports = router;
=======
router.post("/register", register);

export default router;
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
