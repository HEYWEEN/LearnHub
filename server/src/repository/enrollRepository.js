import getPool from "../config/db.js";

export async function findEnrollment(pool, userId, courseId) {
  const [rows] = await pool.query(
    "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
    [userId, courseId]
  );
  return rows[0];
}

export async function insertEnrollment(pool, { id, user_id, course_id }) {
  const sql = `INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (?, ?, ?, NOW())`;
  await pool.query(sql, [id, user_id, course_id]);
}

export async function deleteEnrollment(pool, userId, courseId) {
  await pool.query(
    "DELETE FROM enrollments WHERE user_id = ? AND course_id = ?",
    [userId, courseId]
  );
}
