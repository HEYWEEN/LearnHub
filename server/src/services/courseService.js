import getPool from "../config/db.js";
import STATUS from "../constants/httpStatus.js";
import { v4 as uuidv4 } from "uuid";

// 使用 repository 层（如果已有 repository 文件可以改为 import * as repo from "../repository/coursesRepository.js")
import * as repo from "../repository/coursesRepository.js";
import * as lessonRepo from "../repository/lessonRepository.js";
import * as reviewRepo from "../repository/reviewRepository.js";

export async function getCourses({
  page = 1,
  limit = 12,
  category = "",
  search = "",
}) {
  const offset = (Number(page) - 1) * Number(limit);
  const filters = { category, search };
  const [courses, total] = await Promise.all([
    repo.findCourses({ offset, limit, filters }),
    repo.countCourses({ filters }),
  ]);
  return {
    courses,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getCourseById({ courseId }) {
  const course = await repo.findCourseById(courseId);
  if (!course) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  const lessons = await repo.findLessonsByCourseId(courseId);
  // reviews repository (reviesRepository.js) 名称保留你现有文件里的一致性
  const reviews = (await reviewRepo.findReviewsByCourseId?.(courseId)) || [];
  return { ...course, lessons, reviews };
}

export async function addCourse({ user, payload }) {
  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    const err = new Error("权限不足");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const id = uuidv4();
  const course = {
    id,
    title: payload.title,
    description: payload.description,
    cover_image: payload.cover_image || null,
    category: payload.category || null,
    instructor_id: user.id,
    video_preview: payload.video_preview || null,
  };
  await repo.insertCourse(course);
  return course;
}

export async function removeCourse({ user, courseId }) {
  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    const err = new Error("权限不足");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const course = await repo.findCourseById(courseId);
  if (!course) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  if (course.instructor_id !== user.id && user.role !== "admin") {
    const err = new Error("只能删除自己创建的课程");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  await repo.deleteCourseCascade(courseId);
}

export async function modifyCourse({ user, courseId, payload }) {
  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    const err = new Error("权限不足");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const course = await repo.findCourseById(courseId);
  if (!course) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  if (course.instructor_id !== user.id && user.role !== "admin") {
    const err = new Error("只能修改自己创建的课程");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const toUpdate = {};
  if (payload.title) toUpdate.title = payload.title;
  if (payload.description) toUpdate.description = payload.description;
  if (payload.category) toUpdate.category = payload.category;
  if (typeof payload.cover_image !== "undefined")
    toUpdate.cover_image = payload.cover_image;
  if (typeof payload.video_preview !== "undefined")
    toUpdate.video_preview = payload.video_preview;
  await repo.updateCourse(courseId, toUpdate);
  const updated = await repo.findCourseById(courseId);
  return updated;
}

export async function releaseReview({
  courseId,
  user,
  content,
  rating,
  parentId = null,
}) {
  const id = uuidv4();
  // reviesRepository.js 里实现 insertReview({id, course_id, user_id, comment, rating, parent_id})
  await reviewRepo.insertReview({
    id,
    course_id: courseId,
    user_id: user.id,
    comment: content,
    rating,
    parent_id: parentId,
    created_at: new Date(),
  });
  const created = await reviewRepo.findReviewById(id);
  return created;
}
