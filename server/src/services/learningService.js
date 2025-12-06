import * as learningRepo from "../repository/learningRepository.js";
import * as lessonRepo from "../repository/lessonRepository.js";
import * as noteRepo from "../repository/noteRepository.js";
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

export async function getComplete({ user, courseId }) {
  const complete = await withConnection((conn) =>
    learningRepo.findCompletedLessonId(conn, user.id, courseId)
  );
  return {complete};
}

export async function markCompleted({ user, courseId, lessonId }) {
  return withTransaction(async (conn) => {
    const lesson = await lessonRepo.findLessonById(conn, lessonId);
    if (!lesson) {
      const e = new Error("章节不存在");
      e.status = STATUS.NOT_FOUND;
      throw e;
    }
    const id = uuidv4();
    await learningRepo.upsertProgress(conn, {
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
  const [total, progressRows, notesCount] = await withTransaction(
    async (conn) =>
      Promise.all([
        lessonRepo.countLessonsByCourseId(conn, courseId),
        learningRepo.findProgressByUserCourse(conn, user.id, courseId),
        noteRepo.countNotes(conn, { userId: user.id, courseId }),
      ])
  );
  const lastStudyTime = progressRows
    .map((r) => r.updated_at)
    .sort((a, b) => b - a)[0];
  const completed = progressRows.filter(
    (r) => r.completed === 1 || r.completed === true
  ).length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, rate, notesCount,lastStudyTime, progress: progressRows };
}

export async function getRecentLearning({ user }) {
  const Progress = await withConnection((conn) =>
    learningRepo.findRecentProgress(conn, user.id)
  );
  return Progress;
}

export async function getHistoryLearning({ user, page, limit }) {
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

export async function saveVideoProgress({
  user,
  courseId,
  lessonId,
  currentTime,
  completed = false,
}) {
  return withTransaction(async (conn) => {
    const lesson = await lessonRepo.findLessonById(conn, lessonId);
    if (!lesson) {
      const e = new Error("章节不存在");
      e.status = STATUS.NOT_FOUND;
      throw e;
    }
    const id = uuidv4();
    await learningRepo.upsertProgress(conn, {
      id,
      course_id: courseId,
      lesson_id: lessonId,
      user_id: user.id,
      watch_time: currentTime,
      completed,
    });
  });
}

export async function getVideoProgress({ user, lessonId }) {
  const row = await withConnection((conn) =>
    learningRepo.findProgressByUserLesson(conn, user.id, lessonId)
  );
  return row ? row.watch_time : 0;
}
