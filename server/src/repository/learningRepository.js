import getPool from "../config/db.js";

export async function findAllProgress(pool, userId) {
  const [rows] = await pool.query(
    "SELECT * FROM progress WHERE user_id = ? ORDER BY updated_at DESC",
    [userId]
  );
  return rows;
}

export async function findProgressByUserCourse(pool, userId, courseId) {
  const [rows] = await pool.query(
    "SELECT * FROM progress WHERE user_id = ? AND course_id = ? ORDER BY updated_at DESC",
    [userId, courseId]
  );
  return rows;
}

export async function findProgressByUserLesson(pool, userId, lessonId) {
  const [rows] = await pool.query(
    "SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?",
    [userId, lessonId]
  );
  return rows[0];
}

export async function upsertProgress(
  pool,
  { id, user_id, course_id, lesson_id, completed = undefined , watch_time = undefined }
) {
  // Try update first
  const [existing] = await pool.query(
    "SELECT id FROM progress WHERE user_id = ? AND lesson_id = ?",
    [user_id, lesson_id]
  );
  if (existing && existing.length) {
    let sql = "";
    let params = [];
    if (completed !== undefined) {
      sql += "completed = ?, ";
      params.push(completed ? 1 : 0);
    }
    if (watch_time !== undefined) {
      sql += "watch_time = ?, ";
      params.push(watch_time);
    }
    params.push(user_id, lesson_id);
    await pool.query(
      `UPDATE progress SET ${sql} updated_at = NOW() WHERE user_id = ? AND lesson_id = ?`,
       params
    );
  } else {
    await pool.query(
      "INSERT INTO progress (id, user_id, course_id, lesson_id, completed , watch_time , updated_at) VALUES (?, ?, ?, ?, ?, ? ,NOW())",
      [id, user_id, course_id, lesson_id, completed ? 1 : 0, watch_time? watch_time : 0]
    );
  }
}

export async function deleteProgress(pool, userId, lessonId) {
  await pool.query(
    "DELETE FROM progress WHERE user_id = ? AND lesson_id = ?",
    [userId, lessonId]
  );
}
