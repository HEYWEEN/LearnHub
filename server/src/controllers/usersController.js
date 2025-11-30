import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import * as usersService from "../services/usersService.js";
import fileService from "../services/fileService.js";
const getProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const profile = await usersService.getProfile({ userId });
  return sendSuccess(res, "获取用户信息成功", { profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const updated = await usersService.updateProfile({ user, payload });
  return sendSuccess(res, "更新用户信息成功", { user: updated });
});

const updateAvatar = asyncHandler(async (req, res, next) => {
  const file = await fileService.uploadFileAsync("image")(req, res);
  const coverImageUrl = fileService.getUploadedFilePath(file);
  // 调用服务层更新用户的头像
  const updated = await usersService.updateProfile({
    payload: { avatar: coverImageUrl },
    user: req.user
  });
  return sendSuccess(res, "更新头像成功", { user: updated });
});

const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role = null } = req.query;
  const result = await usersService.listUsers({ page, limit, role });
  return sendSuccess(res, "获取用户列表成功", result);
});

const changeRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const admin = req.user;
  const updated = await usersService.changeRole({ admin, userId, role });
  return sendSuccess(res, "修改角色成功", { user: updated });
});

export { getProfile, updateProfile, listUsers, changeRole,updateAvatar };
