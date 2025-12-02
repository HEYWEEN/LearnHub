import getPool from "../config/db.js";

export async function findCourses(pool,{ offset = 0, limit = 12, filters = {} }) {
  const where = [];
  const params = [];
  if (filters.category) {
    where.push("c.category = ?");
    params.push(filters.category);
  }
  if (filters.search) {
    where.push("(c.title LIKE ? OR c.description LIKE ?)");
    params.push(`%${filters.search}%`);
    params.push(`%${filters.search}%`);
  }
  const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";
  
  // 联表查询获取教师信息和统计信息
  const sql = `
    SELECT 
      c.id,
      c.title,
      c.description,
      c.cover_image as coverImage,
      c.category,
      c.video_preview as videoPreview,
      c.created_at as createdAt,
      c.updated_at as updatedAt,
      u.id as instructorId,
      u.username as instructorName,
      u.avatar as instructorAvatar,
      COALESCE(lesson_count.count, 0) as lessonCount,
      COALESCE(enrollment_count.count, 0) as enrollmentCount
    FROM courses c
    LEFT JOIN users u ON c.instructor_id = u.id
    LEFT JOIN (
      SELECT course_id, COUNT(*) as count 
      FROM lessons 
      GROUP BY course_id
    ) lesson_count ON c.id = lesson_count.course_id
    LEFT JOIN (
      SELECT course_id, COUNT(*) as count 
      FROM enrollments 
      GROUP BY course_id
    ) enrollment_count ON c.id = enrollment_count.course_id
    ${whereSQL}
    ORDER BY c.created_at DESC 
    LIMIT ?, ?
  `;
  
  const [rows] = await pool.query(sql, [
    ...params,
    Number(offset),
    Number(limit),
  ]);
  
  // 转换数据格式，将教师信息嵌套
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    coverImage: row.coverImage,
    category: row.category,
    videoPreview: row.videoPreview,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lessonCount: row.lessonCount,
    enrollmentCount: row.enrollmentCount,
    instructor: {
      id: row.instructorId,
      name: row.instructorName,
      avatar: row.instructorAvatar
    }
  }));
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

export async function findCourseById(pool, courseId) {
  const sql = `
    SELECT 
      c.id,
      c.title,
      c.description,
      c.cover_image as coverImage,
      c.category,
      c.video_preview as videoPreview,
      c.instructor_id as instructorId,
      c.created_at as createdAt,
      c.updated_at as updatedAt,
      u.id as instructor_id,
      u.username as instructorName,
      u.avatar as instructorAvatar,
      u.bio as instructorBio,
      COALESCE(lesson_count.count, 0) as lessonCount,
      COALESCE(enrollment_count.count, 0) as enrollmentCount
    FROM courses c
    LEFT JOIN users u ON c.instructor_id = u.id
    LEFT JOIN (
      SELECT course_id, COUNT(*) as count 
      FROM lessons 
      GROUP BY course_id
    ) lesson_count ON c.id = lesson_count.course_id
    LEFT JOIN (
      SELECT course_id, COUNT(*) as count 
      FROM enrollments 
      GROUP BY course_id
    ) enrollment_count ON c.id = enrollment_count.course_id
    WHERE c.id = ?
  `;
  
  const [rows] = await pool.query(sql, [courseId]);
  
  if (!rows[0]) return null;
  
  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    coverImage: row.coverImage,
    category: row.category,
    videoPreview: row.videoPreview,
    instructorId: row.instructorId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lessonCount: row.lessonCount,
    enrollmentCount: row.enrollmentCount,
    instructor: {
      id: row.instructor_id,
      name: row.instructorName,
      avatar: row.instructorAvatar,
      bio: row.instructorBio
    }
  };
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

export async function findLessonsByCourseId(pool, courseId) {
  const sql = `
    SELECT 
      id,
      course_id as courseId,
      title,
      description,
      video_url as videoUrl,
      duration,
      is_free as isFree,
      created_at as createdAt,
      updated_at as updatedAt
    FROM lessons 
    WHERE course_id = ? 
    ORDER BY created_at
  `;
  const [rows] = await pool.query(sql, [courseId]);
  return rows;
}
