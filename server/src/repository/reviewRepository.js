import getPool from "../config/db.js";

export async function insertReview({
  id,
  course_id,
  user_id,
  comment,
  rating = null,
  parent_id = null,
  created_at = null,
}) {
  const pool = getPool();
  const sql = `INSERT INTO reviews (id, course_id, user_id, comment, rating, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
  await pool.query(sql, [
    id,
    course_id,
    user_id,
    comment,
    rating,
    created_at || new Date(),
  ]);
}

export async function findReviewById(id) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [id]);
  return rows[0];
}

export async function findReviewsByCourseId(courseId) {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT r.*, u.username as user_name, u.avatar as user_avatar FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.course_id = ? ORDER BY r.created_at DESC",
    [courseId]
  );
  return rows;
}
