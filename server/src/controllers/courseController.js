import pool from "../config/db.js";
import STATUS from "../constants/httpStatus.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category = "", search = "" } = req.query;
  const offset = (page - 1) * limit;
  let where = [];
  let params = [];
  if (category) {
    where.push("category = ?");
    params.push(category);
  }
  if (search) {
    where.push("(title LIKE ? OR description LIKE ?)");
    params.push(`%${search}%`);
    params.push(`%${search}%`);
  }
  const whereSQL = where.length > 0 ? "WHERE " + where.join(" AND ") : "";
  const [rows] = await pool.query(
    `SELECT * FROM courses ${whereSQL} LIMIT ?, ?`,
    [...params, offset, Number(limit)]
  );
  const [countRows] = await pool.query(
    `SELECT COUNT(*) as total FROM courses ${whereSQL}`,
    params
  );
  const total = countRows[0].total;
  return sendSuccess(res, "成功获取课程列表", {
    courses: rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  console.log(courseId);
  const [courseRow] = await pool.query("SELECT * FROM courses WHERE id=?", [
    courseId,
  ]);
  if (courseRow.length === 0) {
    const err = new Error("没有找到课程");
    err.status = STATUS.NOT_FOUND;
    return err;
  }
  const course = courseRow[0];
  const [lessonRow] = await pool.query(
    "SELECT * FROM lessons WHERE course_id=?",
    [courseId]
  );
  const [reviewRow] = await pool.query(
    "SELECT * FROM reviews WHERE course_id=?",
    [courseId]
  );
  return sendSuccess(res, "成功找到课程", {
    course: {
      ...course,
      lessons: lessonRow,
      reviews: reviewRow,
    },
  });
});

const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  const [existCourse] = await pool.query("SELECT * FROM courses WHERE id=?", [
    courseId,
  ]);
  if (existCourse.length === 0) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  const [existingEnrollment] = await pool.query(
    "SELECT * FROM enrollments WHERE user_id=? AND course_id=?",
    [userId, courseId]
  );
  if (existingEnrollment.length > 0) {
    return sendSuccess(res, "您已报名该课程", {
      enrollment: existingEnrollment[0],
    });
  }
  const [result] = await pool.query(
    "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)",
    [userId, courseId]
  );
  const [newEnrollmentRow] = await pool.query(
    "SELECT * FROM enrollments WHERE id=?",
    [result.insertId]
  );
  return sendSuccess(res, "报名成功", {
    enrollment: newEnrollmentRow[0],
  });
});

const removeCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const role = req.user.role;
  if (role !== "teacher" && role !== "admin") {
    const err = new Error("权限不足");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const [existCourse] = await pool.query("SELECT * FROM courses WHERE id=?", [
    courseId,
  ]);
  if (existCourse.length === 0) {
    //添加
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  const deleteCourse = existCourse[0];
  if (deleteCourse.instructor_id !== req.user.id && role !== "admin") {
    const err = new Error("只能删除自己创建的课程");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  await pool.query("DELETE FROM courses WHERE id=?", [courseId]);
  await pool.query("DELETE FROM lessons WHERE course_id=?", [courseId]);
  await pool.query("DELETE FROM enrollments WHERE course_id=?", [courseId]);
  await pool.query("DELETE FROM reviews WHERE course_id=?", [courseId]);
  return sendSuccess(res, "课程删除成功", {
    deletion: {
      courseId: courseId,
      userId: req.user.id,
    },
  });
});
const addCourse = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const role = req.user.role;
  if (role !== "teacher" && role !== "admin") {
    const err = new Error("权限不足");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const [row] = await pool.query(
    "INSERT INTO courses (title, description, category, instructor_id) VALUES (?, ?, ?, ?)",
    [title, description, category, req.user.id]
  );
  const courseId = row.insertId;
  return sendSuccess(res, "课程添加成功", {
    course: {
      id: courseId,
      title,
      description,
      category,
      instructor_id: req.user.id,
    },
  });
});

const addLesson = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description,isfree=0 } = req.body;//TODO:上传视频
  const role = req.user.role;
  if (role !== "teacher" && role !== "admin") {
    const err = new Error("权限不足");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const [existCourse] = await pool.query("SELECT * FROM courses WHERE id=?", [
    courseId,
  ]);
  if (existCourse.length === 0) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  const course = existCourse[0];
  if (course.instructor_id !== req.user.id && role !== "admin") {
    const err = new Error("只能为自己创建的课程添加章节");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const [row] = await pool.query(
    "INSERT INTO lessons (course_id, title, description,is_free) VALUES (?, ?, ?, ?)",
    [courseId, title, description,isfree]
  );
  const lessonId = row.insertId;
  return sendSuccess(res, "章节添加成功", {
    lesson: {
      id: lessonId,
      course_id: courseId,
      title,
      description,
      is_free:isfree
    },
  });
});

const removeLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const role = req.user.role;
  if (role !== "teacher" && role !== "admin") {
    const err = new Error("权限不足");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const [existLesson] = await pool.query("SELECT * FROM lessons WHERE id=?", [
    lessonId,
  ]);
  if (existLesson.length === 0) {
    const err = new Error("章节不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  const lesson = existLesson[0];
  const [existCourse] = await pool.query("SELECT * FROM courses WHERE id=?", [
    lesson.course_id,
  ]);
  const course = existCourse[0];
  if (course.instructor_id !== req.user.id && role !== "admin") {
    const err = new Error("只能删除自己创建的课程的章节");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  await pool.query("DELETE FROM lessons WHERE id=?", [lessonId]);
  return sendSuccess(res, "章节删除成功", {
    deletion: {
      lessonId: lessonId,
      userId: req.user.id,
    },
  });
});

const modifyCourse = asyncHandler(async (req, res) => {
  const { title="", description="", category="" } = req.body;
  const { courseId } = req.params;
  const role = req.user.role;
  if (role !== "teacher" && role !== "admin") {
    const err = new Error("权限不足");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  let updateSql = "";
  let updateParams = [];
  if(title!==""){
    updateSql += `title=?,`;
    updateParams.push(title);
  }
  if(description!==""){
    updateSql += `description=?,`;
    updateParams.push(description);
  }
  if(category!==""){
    updateSql += `category=?,`;
    updateParams.push(category);
  }
  updateSql = updateSql.slice(0, -1);
  updateParams.push(courseId);
  await pool.query(`UPDATE courses SET ${updateSql} WHERE id=?`, updateParams);
  const [updatedCourseRow] = await pool.query(
    "SELECT * FROM courses WHERE id=?",
    [courseId]
  );
  return sendSuccess(res, "课程修改成功", {
    course: updatedCourseRow[0],
  });
});

const modifyLesson = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title="", description="",isfree=-1 } = req.body;//TODO:上传视频
  const role = req.user.role;
  if (role !== "teacher" && role !== "admin") {
    const err = new Error("权限不足");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const [existCourse] = await pool.query("SELECT * FROM courses WHERE id=?", [
    courseId,
  ]);
  if (existCourse.length === 0) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  const course = existCourse[0];
  if (course.instructor_id !== req.user.id && role !== "admin") {
    const err = new Error("只能修改自己创建的课程的章节");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  let updateSql = "";
  let updateParams = [];
  if(title!==""){
    updateSql += `title=?,`;
    updateParams.push(title);
  }
  if(description!==""){
    updateSql += `description=?,`;
    updateParams.push(description);
  }
  if(isfree!==-1){
    updateSql += `is_free=?,`;
    updateParams.push(isfree);
  }
  updateSql = updateSql.slice(0, -1);
  updateParams.push(courseId);
  await pool.query(`UPDATE lessons SET ${updateSql} WHERE course_id=?`, updateParams);
  const [updatedLessonRow] = await pool.query(
    "SELECT * FROM lessons WHERE course_id=?",
    [courseId]
  );
  return sendSuccess(res, "章节修改成功", {
    lessons: updatedLessonRow,
  });
});

export {
  getCourses,
  getCourseById,
  enrollCourse,
  addCourse,
  removeCourse,
  modifyCourse,
  addLesson,
  removeLesson,
  modifyLesson,
};
