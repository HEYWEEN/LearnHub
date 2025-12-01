import getPool from "../config/db.js";

export async function findUserById(pool, id) {
  const [rows] = await pool.query(
    "SELECT id, username, email, avatar, bio, role, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
}

export async function listUsers(pool, { page = 1, limit = 20, role }) {
  const offset = (Number(page) - 1) * Number(limit);
  const where = [];
  const params = [];
  if (role) {
    where.push("role = ?");
    params.push(role);
  }
  const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";
  const [rows] = await pool.query(
    `SELECT id, username, email, avatar, bio, role FROM users ${whereSQL} ORDER BY created_at DESC LIMIT ?, ?`,
    [...params, offset, Number(limit)]
  );
  return rows;
}

export async function countUsers(pool, { role }) {
  let rows = null;
  if (role) {
    [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM users where role = ?",
      [role]
    );
  } else {
    [rows] = await pool.query("SELECT COUNT(*) as total FROM users");
  }
  return rows[0] ? rows[0].total : 0;
}

export async function updateUserRole(pool, userId, role) {
  await pool.query(
    "UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?",
    [role, userId]
  );
}

export async function updateUserProfile(pool, userId, fields = {}) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const params = keys.map((k) => fields[k]);
  params.push(userId);
  await pool.query(
    `UPDATE users SET ${sets}, updated_at = NOW() WHERE id = ?`,
    params
  );
}
