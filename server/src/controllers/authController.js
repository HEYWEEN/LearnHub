import pool from '../config/db.js';
import STATUS from '../constants/httpStatus.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

const register = asyncHandler(async (req,res)=>{
  const {email, password, username , role = "student"} = req.body;
  const existingUser = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existingUser[0].length > 0) {
    const err = new Error("邮箱已被注册");
    err.status = STATUS.BAD_REQUEST;
    throw err;
  }
  const [rows] = await pool.query(
    "INSERT INTO users (id, email, password, username, role) VALUES (UUID(),?, ?, ?, ?)"
    ,[email, password, username, role]
  );
  const [userRows] = await pool.query(
    "SELECT id, email, username, role, created_At FROM users WHERE id = ?"
    ,[rows.insertId]
  );
  const user = userRows[0];
  return sendSuccess(res, "注册成功",{user, token:"temp-none"} );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password]
  );
  if (rows.length === 0) {
    const err = new Error("邮箱或密码错误");
    err.status = STATUS.UNAUTHORIZED;
    throw err;
  }
  const user = rows[0];
  return sendSuccess(res, "登录成功", { user, token:"your-token" });
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