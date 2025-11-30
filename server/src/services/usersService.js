import * as usersRepo from "../repository/usersRepository.js";
import STATUS from "../constants/httpStatus.js";

export async function getProfile({ userId }) {
  const profile = await usersRepo.findUserById(userId);
  if (!profile) {
    const e = new Error("用户不存在");
    e.status = STATUS.NOT_FOUND;
    throw e;
  }
  return profile;
}

export async function updateProfile({ user, payload }) {
  const fields = {};
  if (payload.username) fields.username = payload.username;
  if (typeof payload.bio !== "undefined") fields.bio = payload.bio;
  if (typeof payload.avatar !== "undefined") fields.avatar = payload.avatar;
  await usersRepo.updateUserProfile(user.id, fields);
  return await usersRepo.findUserById(user.id);
}

export async function listUsers({ page = 1, limit = 20, role }) {
  const rows = await usersRepo.listUsers({ page, limit, role });
  const total = await usersRepo.countUsers({role});
  return {
    users: rows,
    pagination: { page: Number(page), limit: Number(limit),total,pages:Math.ceil( total/Number(limit)) },
  };
}

export async function changeRole({ admin, userId, role }) {
  await usersRepo.updateUserRole(userId, role);
  return await usersRepo.findUserById(userId);
}

