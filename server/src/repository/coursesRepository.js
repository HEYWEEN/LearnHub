import getPool from "../config/db.js";

export async function findCourses(pool,{ offset = 0, limit = 12, filters = {} }) {
  const where = [];
  const params = [];
  if (filters.category) {
    where.push("category = ?");
    params.push(filters.category);
  }
  if (filters.search) {
    where.push("(title LIKE ? OR description LIKE ?)");
    params.push(`%${filters.search}%`);
    params.push(`%${filters.search}%`);
  }
  const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";
  const sql = `SELECT * FROM courses ${whereSQL} ORDER BY created_at DESC LIMIT ?, ?`;
  const [rows] = await pool.query(sql, [
    ...params,
    Number(offset),
    Number(limit),
  ]);
  return rows;
}

export async function countCourses(pool,{ filters = {} }) {
  const where = [];
  const params = [];
  if (filters.category) {
    where.push("category = ?");
    params.push(filters.category);
  }
  if (filters.search) {
    where.push("(title LIKE ? OR description LIKE ?)");
    params.push(`%${filters.search}%`);
    params.push(`%${filters.search}%`);
  }
  const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";
  const sql = `SELECT COUNT(*) as total FROM courses ${whereSQL}`;
  const [rows] = await pool.query(sql, params);
  return rows[0] ? rows[0].total : 0;
}

export async function findCourseById(pool,courseId) {
  const [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [
    courseId,
  ]);
  return rows[0];
}

export async function insertCourse(pool,course) {
  const sql = `INSERT INTO courses (id, title, description, cover_image, category, instructor_id, video_preview, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
  await pool.query(sql, [
    course.id,
    course.title || null,
    course.description || null,
    course.cover_image || null,
    course.category || null,
    course.instructor_id || null,
    course.video_preview || null,
  ]);
}

export async function updateCourse(pool,courseId, fields = {}) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const params = keys.map((k) => fields[k]);
  params.push(courseId);
  const sql = `UPDATE courses SET ${sets}, updated_at = NOW() WHERE id = ?`;
  await pool.query(sql, params);
}

export async function deleteCourse(pool,courseId) {
  await pool.query("DELETE FROM courses WHERE id = ?", [courseId]);
}

export async function findLessonsByCourseId(pool,courseId) {
  const [rows] = await pool.query(
    "SELECT * FROM lessons WHERE course_id = ? ORDER BY created_at",
    [courseId]
  );
  return rows;
}
