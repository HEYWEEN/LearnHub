import getPool from "../config/db.js";

export async function insertReview(
  pool,
  {
    id,
    course_id,
    user_id,
    comment,
    rating = null,
    parent_id = null,
    created_at = null,
  }
) {
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

export async function findReviewById(pool, id) {
  const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [id]);
  return rows[0];
}

export async function findReviewsByCourseId(pool, courseId) {
  const [rows] = await pool.query(
    "SELECT r.*, u.username as user_name, u.avatar as user_avatar FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.course_id = ? ORDER BY r.created_at DESC",
    [courseId]
  );
  return rows;
}

export async function deleteReviewById(pool, id) {
  const sql = `DELETE FROM reviews WHERE id = ?`;
  await pool.query(sql, [id]);
}

export async function updateReviewById(pool, id, { comment, rating }) {
  const sql = `UPDATE reviews SET comment = ?, rating = ? WHERE id = ?`;
  await pool.query(sql, [comment, rating, id]);
}
