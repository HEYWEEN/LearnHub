import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import * as authService from "../services/authService.js";

const register = asyncHandler(async (req, res) => {
  const payload = req.body;
  const user = await authService.register(payload);
  return sendSuccess(res, "注册成功", { user });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return sendSuccess(res, "登录成功", result);
});

const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  const profile = await authService.getProfile({ user });
  return sendSuccess(res, "获取用户信息成功", { profile });
});

const refreshToken = asyncHandler(async (req, res) => {
  const user = req.user;
  const tokens = await authService.refreshToken({ user });
  return sendSuccess(res, "刷新 token 成功", tokens);
});

const changePassword = asyncHandler(async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword({ user, oldPassword, newPassword });
  return sendSuccess(res, "修改密码成功");
});

const deleteAccount = asyncHandler(async (req, res) => {
  const user = req.user;
  const { password } = req.body;
  await authService.deleteAccount({ user,password });
  return sendSuccess(res, "删除账号成功");
});

export { register, login, getMe, refreshToken,changePassword,deleteAccount };
