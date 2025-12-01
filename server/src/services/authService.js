import * as authRepo from "../repository/authRepository.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { v4 as uuidv4 } from "uuid";
import STATUS from "../constants/httpStatus.js";
import { generateToken, getSecretKey } from "../config/jwt.js";
import jwt from "jsonwebtoken";
import {
  withConnection,
  withTransaction,
} from "../repository/transactionRepository.js";

export async function register(payload) {
  if(!payload.email || !payload.password) {
    const e = new Error("邮箱和密码为必填项");
    e.status = STATUS.BAD_REQUEST;
    throw e;
  }
  return await withTransaction(async (conn) => {
    const existing = await authRepo.findUserByEmail(conn, payload.email);
    if (existing) {
      const e = new Error("邮箱已被注册");
      e.status = STATUS.BAD_REQUEST;
      throw e;
    }
    const id = uuidv4();
    const hashed = await hashPassword(payload.password);

    authRepo.insertUser(conn, {
      id,
      username: payload.username || payload.email,
      email: payload.email,
      password: hashed,
      role: payload.role || "student",
    });

    const created = await authRepo.findUserById(conn, id);
    if (created) {
      delete created.password;
    }
    let token = null;
    try {
      token = await generateToken(created);
    } catch (err) {
      // token 生成失败不阻止用户创建
    }
    return { user: created, token };
  });
}

export async function login({ email, password ,role}) {
  const user = await withConnection((conn) =>
    authRepo.findUserByEmail(conn, email)
  );
  if (!user) {
    const e = new Error("用户不存在或密码错误");
    e.status = STATUS.UNAUTHORIZED;
    throw e;
  }
  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const e = new Error("用户不存在或密码错误");
    e.status = STATUS.UNAUTHORIZED;
    throw e;
  }
  if(role && user.role !== role) {
    const e = new Error("用户角色不匹配");
    e.status = STATUS.UNAUTHORIZED;
    throw e;
  }
  const safe = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
  };
  let token = null;
  try {
    token = await generateToken(user);
  } catch (err) {}
  return { user: safe, token };
}

export async function getProfile({ user }) {
  if (!user) {
    const e = new Error("未登录");
    e.status = STATUS.UNAUTHORIZED;
    throw e;
  }
  const profile = await withConnection((conn) =>
    authRepo.findUserById(conn, user.id)
  );
  if (profile) delete profile.password;
  return profile;
}

export async function refreshToken({ user }) {
  const refreshedUser = await withConnection((conn) =>
    authRepo.findUserById(conn, user.id)
  );
  if (!refreshedUser) {
    const e = new Error("用户不存在");
    e.status = STATUS.NOT_FOUND;
    throw e;
  }
  const newToken = await generateToken(refreshedUser);
  return { token: newToken };
}

export async function changePassword({ user, oldPassword, newPassword }) {
  const existing = await withConnection((conn) =>
    authRepo.findUserById(conn, user.id)
  );
  if (!existing) {
    const e = new Error("用户不存在");
    e.status = STATUS.NOT_FOUND;
    throw e;
  }
  const ok = await comparePassword(oldPassword, existing.password);
  if (!ok) {
    const e = new Error("旧密码错误");
    e.status = STATUS.UNAUTHORIZED;
    throw e;
  }
  const hashed = await hashPassword(newPassword);
  await withConnection((conn) =>
    authRepo.updateUserPassword(conn, user.id, hashed)
  );
  return;
}

export async function deleteAccount({ user, password }) {
  const existing = await withConnection((conn) =>
    authRepo.findUserById(conn, user.id)
  );
  if (!existing) {
    const e = new Error("用户不存在");
    e.status = STATUS.NOT_FOUND;
    throw e;
  }
  const ok = await comparePassword(password, existing.password);
  if (!ok) {
    const e = new Error("密码错误");
    e.status = STATUS.UNAUTHORIZED;
    throw e;
  }
  await withTransaction(async (conn) => {
    await authRepo.deleteUserById(conn, user.id);
    // TODO: 添加其他关联数据的删除逻辑
  });
  return;
}
