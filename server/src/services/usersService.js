import * as usersRepo from "../repository/usersRepository.js";
import STATUS from "../constants/httpStatus.js";
import {
  withConnection,
  withTransaction,
} from "../repository/transactionRepository.js";

export async function getProfile({ userId }) {
  const profile = await withConnection((conn) =>
    usersRepo.findUserById(conn, userId)
  );
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
  return await withTransaction(async (conn) => {
    await usersRepo.updateUserProfile(conn, user.id, fields);
    return await usersRepo.findUserById(conn, user.id);
  });
}

export async function listUsers({ page = 1, limit = 20, role }) {
  const [rows, total] = await withTransaction(async (conn) =>
    Promise.all([
      usersRepo.listUsers(conn, { page, limit, role }),
      usersRepo.countUsers(conn, { role }),
    ])
  );
  return {
    users: rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
}

export async function changeRole({ admin, userId, role }) {
  return withTransaction(async (conn) => {
    await usersRepo.updateUserRole(conn, userId, role);
    return await usersRepo.findUserById(conn, userId);
  });
}
