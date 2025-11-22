import getPool from "../config/db.js";

export async function findUserByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

export async function findUserById(id) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

export async function insertUser({
  id,
  username,
  email,
  password,
  role = "student",
  avatar = null,
  bio = null,
}) {
  const pool = getPool();
  const sql =
    "INSERT INTO users (id, username, email, password, avatar, bio, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
  await pool.query(sql, [id, username, email, password, avatar, bio, role]);
}

export async function updateUserById(id, fields = {}) {
  const pool = getPool();
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const params = keys.map((k) => fields[k]);
  params.push(id);
  const sql = `UPDATE users SET ${sets}, updated_at = NOW() WHERE id = ?`;
  await pool.query(sql, params);
}
