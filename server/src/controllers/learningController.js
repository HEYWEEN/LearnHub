import { asyncHandler } from "../utils/asyncHandler.js";
import getPool from "../config/db.js";
import { sendSuccess } from "../utils/response.js";

const getProgress = asyncHandler(async (req, res) => {
  const pool = getPool();
  const userId = req.user.id;
  const courseId = req.params.courseId;
  const [rows] = await pool.query(
    "SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = TRUE",
    [userId, courseId]
  );
  const completedLessons = rows.map((row) => row.lesson_id);
  const [lastlessonId] = await pool.query(
    "SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ? ORDER BY updated_at DESC LIMIT 1",
    [userId, courseId]
  );
  return sendSuccess(res, "获取学习进度成功", {
    completedLessons,
    lastLessonId: lastlessonId.length > 0 ? lastlessonId[0].lesson_id : null,
  });
});

const updateProgress = asyncHandler(async (req, res) => {
  const pool = getPool();
  const userId = req.user.id;
  const lessonId = req.params.lessonId;
  const { completed } = req.body;
  const [row] = await pool.query(
    "SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?",
    [userId, lessonId]
  );
  if (row.length > 0) {
    await pool.query(
      "UPDATE progress SET completed = ? WHERE user_id = ? AND lesson_id = ?",
      [completed, userId, lessonId]
    );
  } else {
    await pool.query(
      "INSERT INTO progress (user_id, lesson_id, course_id, completed) VALUES (?, ?, (SELECT course_id FROM lessons WHERE id = ?), ?)",
      [userId, lessonId, lessonId, completed]
    );
  }
  return sendSuccess(res, "学习进度更新成功", {
    progress: {
      lessonId,
      completed,
    },
  });
});

export { getProgress, updateProgress };
