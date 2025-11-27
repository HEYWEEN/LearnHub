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
  // 使用封装后的 uploadFileAsync，这样可以直接使用 async/await
  await new Promise((resolve, reject) => {
    fileService.uploadFileAsync("image")(req, res, (err) => {
      if (err) return reject(err); // 上传错误时抛出异常
      resolve(); // 上传成功，继续执行
    });
  });
  // 获取上传后的文件路径
  const coverImageUrl = fileService.getUploadedFilePath(req.file);
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
