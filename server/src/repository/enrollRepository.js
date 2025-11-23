import getPool from "../config/db.js";

export async function findEnrollment(userId, courseId) {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
    [userId, courseId]
  );
  return rows[0];
}

export async function insertEnrollment({ id, user_id, course_id }) {
  const pool = getPool();
  const sql = `INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (?, ?, ?, NOW())`;
  await pool.query(sql, [id, user_id, course_id]);
}

export async function deleteEnrollment(userId, courseId) {
  const pool = getPool();
  await pool.query(
    "DELETE FROM enrollments WHERE user_id = ? AND course_id = ?",
    [userId, courseId]
  );
}
