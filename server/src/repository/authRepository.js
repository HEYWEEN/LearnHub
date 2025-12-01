import getPool from "../config/db.js";

export async function findUserByEmail(pool, email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

export async function findUserById(pool, id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

export async function insertUser(
  pool,
  { id, username, email, password, role = "student", avatar = null, bio = null }
) {
  const sql =
    "INSERT INTO users (id, username, email, password, avatar, bio, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
  await pool.query(sql, [id, username, email, password, avatar, bio, role]);
}

export async function updateUserById(pool, id, fields = {}) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const params = keys.map((k) => fields[k]);
  params.push(id);
  const sql = `UPDATE users SET ${sets}, updated_at = NOW() WHERE id = ?`;
  await pool.query(sql, params);
}

export async function deleteUserById(pool, id) {
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
}

export async function updateUserPassword(pool, id, newPassword) {
  await pool.query(
    "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
    [newPassword, id]
  );
}
