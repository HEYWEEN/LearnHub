import getPool from "../config/db.js";

export async function insertLesson(pool, lesson) {
  const sql = `INSERT INTO lessons (id, course_id, title, description, video_url, duration, is_free, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
  await pool.query(sql, [
    lesson.id,
    lesson.course_id,
    lesson.title || null,
    lesson.description || null,
    lesson.video_url || null,
    lesson.duration || null,
    lesson.is_free ? 1 : 0,
  ]);
}

export async function findLessonById(pool, lessonId) {
  const [rows] = await pool.query("SELECT * FROM lessons WHERE id = ?", [
    lessonId,
  ]);
  return rows[0];
}

export async function deleteLesson(pool, lessonId) {
  await pool.query("DELETE FROM lessons WHERE id = ?", [lessonId]);
}

export async function updateLessonById(pool, lessonId, fields = {}) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const params = keys.map((k) => fields[k]);
  params.push(lessonId);
  const sql = `UPDATE lessons SET ${sets}, updated_at = NOW() WHERE id = ?`;
  await pool.query(sql, params);
}

export async function findLessonsByCourseId(pool, courseId) {
  const [rows] = await pool.query(
    "SELECT * FROM lessons WHERE course_id = ? ORDER BY created_at",
    [courseId]
  );
  return rows;
}
