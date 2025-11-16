import { asyncHandler } from "../utils/asyncHandler.js";
import pool from "../config/db.js";
import STATUS from "../constants/httpStatus.js";
import { sendSuccess } from "../utils/response.js";

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await pool.query(
    "SELECT id, username, email, avatar,bio,created_at FROM users WHERE id = ?",
    [userId]
  );
  if (user.length === 0) {
    const err = new Error("没有找到用户");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  return sendSuccess(res, { user: user[0] });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username = "", avatar = "", bio = "" } = req.body;
  const id = req.user.id;
  await pool.query(
    "UPDATE users SET username = ?, avatar = ?, bio = ? WHERE id = ?",
    [username, avatar, bio, id]
  );
  return sendSuccess(res, { message: "用户信息更新成功" ,user:{id,username,avatar,bio}});
});

export { getProfile, updateProfile };
