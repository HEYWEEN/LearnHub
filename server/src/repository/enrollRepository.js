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

export async function findEnrollmentByTeacherId(pool, userId) {
  const [rows] = await pool.query(
    `SELECT e.id AS enrollment_id, e.enrolled_at, c.id AS course_id, c.title AS course_title,u.id AS student_id, u.username, u.email, u.avatar, u.created_at AS student_created_at
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     JOIN users u ON e.user_id = u.id
     WHERE c.instructor_id = ?`,
    [userId]
  );
  return rows;
}

export async function countEnrollmentTeacher(pool, user_id) {
  const [total] = await pool.query(
    `SELECT COUNT(e.id) AS total_enrollments
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     WHERE c.instructor_id = ?`,
    [user_id]
  );
  return total[0].total_enrollments;
}

export async function findEnrolledStudentNumOfTeacher(pool, user_id) {
  //获取学生具体账号具体信息
  const [rows] = await pool.query(
    `SELECT DISTINCT u.id, u.username, u.email,u.avata,u.bio,u.created_at,e.enrolled_at
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     JOIN users u ON e.user_id = u.id
     WHERE c.instructor_id = ?`,
    [user_id]
  );
  return rows;
}

export async function countEnrolledStudentNumOfTeacher(pool, user_id) {
  const [total] = await pool.query(
    `SELECT COUNT(DISTINCT e.user_id) AS total_enrollments
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     WHERE c.instructor_id = ?`,
    [user_id]
  );
  return total[0].total_enrollments;
}
