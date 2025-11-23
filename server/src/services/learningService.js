import * as learningRepo from "../repository/learningRepository.js";
import * as lessonRepo from "../repository/lessonRepository.js";
import { v4 as uuidv4 } from "uuid";
import STATUS from "../constants/httpStatus.js";

export async function getProgress({ user, courseId }) {
  const rows = await learningRepo.findProgressByUserCourse(user.id, courseId);
  return rows;
}

export async function markCompleted({ user, courseId, lessonId }) {
  const lesson = await lessonRepo.findLessonById(lessonId);
  if (!lesson) {
    const e = new Error("章节不存在");
    e.status = STATUS.NOT_FOUND;
    throw e;
  }
  const id = uuidv4();
  await learningRepo.upsertProgress({
    id,
    user_id: user.id,
    course_id: courseId,
    lesson_id: lessonId,
    completed: true,
  });
  return { userId: user.id, courseId, lessonId, completed: true };
}

export async function getCourseLearning({ user, courseId }) {
  // 返回课程学习进度汇总：总章节数、已完成数、完成率
  const lessons = await lessonRepo.findLessonsByCourseId(courseId);
  const progressRows = await learningRepo.findProgressByUserCourse(
    user.id,
    courseId
  );
  const total = lessons.length || 0;
  const completed = progressRows.filter(
    (r) => r.completed === 1 || r.completed === true
  ).length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, rate, lessons, progress: progressRows };
}
