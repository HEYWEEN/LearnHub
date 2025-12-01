import * as learningRepo from "../repository/learningRepository.js";
import * as lessonRepo from "../repository/lessonRepository.js";
import { v4 as uuidv4 } from "uuid";
import STATUS from "../constants/httpStatus.js";
import {
  withConnection,
  withTransaction,
} from "../repository/transactionRepository.js";

export async function getProgress({ user, courseId }) {
  const rows = await withConnection((conn) =>
    learningRepo.findProgressByUserCourse(conn, user.id, courseId)
  );
  return rows;
}

export async function markCompleted({ user, courseId, lessonId }) {
  return withTransaction(async (conn) => {
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
  });
}

export async function getCourseLearning({ user, courseId }) {
  // 返回课程学习进度汇总：总章节数、已完成数、完成率
  const [lessons, progressRows] = await withTransaction(async (conn) =>
    Promise.all([
      lessonRepo.findLessonsByCourseId(courseId),
      learningRepo.findProgressByUserCourse(user.id, courseId),
    ])
  );
  const total = lessons.length || 0;
  const completed = progressRows.filter(
    (r) => r.completed === 1 || r.completed === true
  ).length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, rate, lessons, progress: progressRows };
}

export async function getRecentLearning({ user, page, limit }) {
  const allProgress = await withConnection((conn) =>
    learningRepo.findAllProgress(conn, user.id)
  );
  const total = allProgress.length;
  let progress;
  if (page * limit > total) {
    progress = [];
  } else {
    progress = allProgress.splice((page - 1) * limit, page * limit);
  }
  return {
    progress,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
