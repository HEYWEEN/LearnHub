import STATUS from "../constants/httpStatus.js";
import { v4 as uuidv4 } from "uuid";

import * as repo from "../repository/coursesRepository.js";
import * as lessonRepo from "../repository/lessonRepository.js";
import * as reviewRepo from "../repository/reviewRepository.js";
import * as learningRepo from "../repository/learningRepository.js";
import {
  withConnection,
  withTransaction,
} from "../repository/transactionRepository.js";

export async function getCourses({
  page = 1,
  limit = 12,
  category = "",
  search = "",
}) {
  const offset = (Number(page) - 1) * Number(limit);
  const filters = { category, search };
  const [courses, total] = await withTransaction((conn) =>
    Promise.all([
      repo.findCourses(conn, { offset, limit, filters }),
      repo.countCourses(conn, { filters }),
    ])
  );
  
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
  return await withTransaction(async (conn) => {
    const course = await repo.findCourseById(conn, courseId);
    if (!course) {
      const err = new Error("课程不存在");
      err.status = STATUS.NOT_FOUND;
      throw err;
    }
    const lessons = await repo.findLessonsByCourseId(conn, courseId);
    const reviews = await reviewRepo.findReviewsByCourseId(conn, courseId);
    return { ...course, lessons, reviews };
  });
}

export async function addCourse({ user, payload }) {
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
  await withConnection((conn) => repo.insertCourse(conn, course));
  return course;
}

export async function removeCourse({ user, courseId }) {
  await withTransaction(async (conn) => {
    const course = await repo.findCourseById(conn, courseId);
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
    await lessonRepo.deleteLesson(conn, courseId);
    await reviewRepo.deleteReviewById(conn, courseId);
    await learningRepo.deleteProgress(conn, courseId);
    await repo.deleteCourse(conn, courseId);
  });
}

export async function modifyCourse({ user, courseId, payload }) {
  return await withTransaction(async (conn) => {
    const course = await repo.findCourseById(conn, courseId);
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
    // 更新课程信息
    await repo.updateCourse(conn, courseId, toUpdate);
    const updated = await repo.findCourseById(conn, courseId);
    return updated;
  });
}

export async function releaseReview({
  courseId,
  user,
  content,
  rating,
  parentId = null,
}) {
  const id = uuidv4();
  const created = await withTransaction(async (conn) => {
    await reviewRepo.insertReview({
      id,
      course_id: courseId,
      user_id: user.id,
      comment: content,
      rating,
      parent_id: parentId,
      created_at: new Date(),
    });
    return await reviewRepo.findReviewById(id);
  });
  return created;
}
