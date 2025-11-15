import pool from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const register = (req, res) => {
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
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password]
  );

  if (rows.length === 0) {
    const err = new Error("邮箱或密码错误");
    err.status = 401;
    throw err;
  }

  const user = rows[0];

  return res.json({
    success: true,
    message: "登录成功",
    data: {
      user,
      token: "your-token",
    },
    code: 200,
  });
});

const getMe = (req, res) => {
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
};

export { register, login, getMe };