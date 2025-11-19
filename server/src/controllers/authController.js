import getPool from "../config/db.js";
import { generateToken } from "../config/jwt.js";
import STATUS from "../constants/httpStatus.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const register = asyncHandler(async (req, res) => {
  const pool = getPool();
  const { email, password, username, role = "student" } = req.body;
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  if (existingUser[0].length > 0) {
    const err = new Error("邮箱已被注册");
    err.status = STATUS.BAD_REQUEST;
    throw err;
  }
  const [rows] = await pool.query(
    "INSERT INTO users (id, email, password, username, role) VALUES (UUID(),?, ?, ?, ?)",
    [email, password, username, role]
  );
  const [userRows] = await pool.query(
    "SELECT id, email, username, role, created_At FROM users WHERE email = ?",
    [email]
  );
  const user = userRows[0];
  const token = await generateToken(user);
  return sendSuccess(res, "注册成功", { user, token });
});

const login = asyncHandler(async (req, res) => {
  const pool = getPool();
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
  const token = await generateToken(user);
  return sendSuccess(res, "登录成功", { user, token });
});

const getMe = (req, res) => {
  const pool = getPool();
  const { iat = undefined, exp = undefined, ...user } = req.user; //不想显示的加在前面,按格式
  return sendSuccess(res, "获取用户信息成功", { user });
};

export { register, login, getMe };
