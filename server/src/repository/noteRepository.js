import getPool from "../config/db.js";

export async function insertNote(pool, note) {
  const sql = `INSERT INTO notes (id, user_id, course_id, lesson_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
  await pool.query(sql, [
    note.id,
    note.user_id,
    note.course_id || null,
    note.lesson_id || null,
    note.content,
  ]);
}

export async function findNoteById(pool, id) {
  const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
  return rows[0];
}

export async function findNote(pool, { userId, courseId, lessonId }) {
  const where = ["user_id = ?"];
  const params = [userId];
  if (courseId) {
    where.push("course_id = ?");
    params.push(courseId);
  } else {
    where.push("course_id IS NULL");
  }
  if (lessonId) {
    where.push("lesson_id = ?");
    params.push(lessonId);
  } else {
    where.push("lesson_id IS NULL");
  }
  const whereSQL = where.join(" AND ");
  const sql = `SELECT * FROM notes WHERE ${whereSQL} LIMIT 1`;
  const [rows] = await pool.query(sql, params);
  return rows[0];
}

export async function updateNoteById(pool, id, fields = {}) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const params = keys.map((k) => fields[k]);
  params.push(id);
  const sql = `UPDATE notes SET ${sets}, updated_at = NOW() WHERE id = ?`;
  await pool.query(sql, params);
}

export async function deleteNoteById(pool, id) {
  await pool.query("DELETE FROM notes WHERE id = ?", [id]);
}

export async function listNotes(
  pool,
  { userId, courseId, lessonId, offset = 0, limit = 20 }
) {
  const where = [];
  const params = [];
  if (userId) {
    where.push("user_id = ?");
    params.push(userId);
  }
  if (courseId) {
    where.push("course_id = ?");
    params.push(courseId);
  }
  if (lessonId) {
    where.push("lesson_id = ?");
    params.push(lessonId);
  }
  const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";
  const sql = `SELECT * FROM notes ${whereSQL} ORDER BY created_at DESC LIMIT ?, ?`;
  const [rows] = await pool.query(sql, [
    ...params,
    Number(offset),
    Number(limit),
  ]);
  return rows;
}

export async function countNotes(pool, { userId, courseId, lessonId }) {
  const where = [];
  const params = [];
  if (userId) {
    where.push("user_id = ?");
    params.push(userId);
  }
  if (courseId) {
    where.push("course_id = ?");
    params.push(courseId);
  }
  if (lessonId) {
    where.push("lesson_id = ?");
    params.push(lessonId);
  }
  const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";
  const sql = `SELECT COUNT(*) as total FROM notes ${whereSQL}`;
  const [rows] = await pool.query(sql, params);
  return rows[0] ? rows[0].total : 0;
}
