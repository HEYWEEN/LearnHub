import getPool from "../config/db.js";

export async function insertNote(note) {
  const pool = getPool();
  const sql = `INSERT INTO notes (id, user_id, course_id, lesson_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
  await pool.query(sql, [
    note.id,
    note.user_id,
    note.course_id || null,
    note.lesson_id || null,
    note.content,
  ]);
}

export async function findNoteById(id) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
  return rows[0];
}

export async function updateNoteById(id, fields = {}) {
  const pool = getPool();
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const params = keys.map((k) => fields[k]);
  params.push(id);
  const sql = `UPDATE notes SET ${sets}, updated_at = NOW() WHERE id = ?`;
  await pool.query(sql, params);
}

export async function deleteNoteById(id) {
  const pool = getPool();
  await pool.query("DELETE FROM notes WHERE id = ?", [id]);
}

export async function listNotes({
  userId,
  courseId,
  lessonId,
  offset = 0,
  limit = 20,
}) {
  const pool = getPool();
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
