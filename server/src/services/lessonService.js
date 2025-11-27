import * as repo from "../repository/lessonRepository.js";
import * as courseRepo from "../repository/coursesRepository.js";
import STATUS from "../constants/httpStatus.js";
import { v4 as uuidv4 } from "uuid";

export async function addLesson({ user, courseId, payload }) {
  const course = await courseRepo.findCourseById(courseId);
  if (!course) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  if (course.instructor_id !== user.id && user.role !== "admin") {
    const err = new Error("只能为自己创建的课程添加章节");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const id = uuidv4();
  const lesson = {
    id,
    course_id: courseId,
    title: payload.title,
    description: payload.description || null,
    video_url: payload.video_url || null,
    duration: payload.duration || null,
    is_free: payload.is_free ? 1 : 0,
  };
  await repo.insertLesson(lesson);
  return lesson;
}

export async function removeLesson({ user, lessonId }) {
  const lesson = await repo.findLessonById(lessonId);
  if (!lesson) {
    const err = new Error("章节不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  const course = await courseRepo.findCourseById(lesson.course_id);
  if (!course) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  if (course.instructor_id !== user.id && user.role !== "admin") {
    const err = new Error("只能删除自己创建的课程的章节");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  await repo.deleteLesson(lessonId);
}

export async function modifyLesson({ user, courseId, lessonId, payload }) {
  const course = await courseRepo.findCourseById(courseId);
  if (!course) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  if (course.instructor_id !== user.id && user.role !== "admin") {
    const err = new Error("只能修改自己创建的课程的章节");
    err.status = STATUS.FORBIDDEN;
    throw err;
  }
  const update = {};
  if (payload.title) update.title = payload.title;
  if (payload.description) update.description = payload.description;
  if (typeof payload.is_free !== "undefined")
    update.is_free = payload.is_free ? 1 : 0;
  if (payload.video_url) update.video_url = payload.video_url;
  if (typeof payload.duration !== "undefined")
    update.duration = payload.duration;
  await repo.updateLessonById(lessonId, update);
  const lessons = await repo.findLessonsByCourseId(courseId);
  return lessons;
}

export async function getLessonByCourseId({courseId}) {
  const lessons = await repo.findLessonsByCourseId(courseId);
  return lessons;
}
