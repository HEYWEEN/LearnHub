import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getProgress,
  getRecentLearning,
  markCompleted,
  saveVideoProgress,
  getVideoProgress,
  getHistoryLearning,
} from "../controllers/learningController.js";
const router = express.Router();

// 获取学习进度
// GET /learning/progress/{courseId}
// 请求头:
// Authorization: Bearer {token}
router.get("/progress/:courseId", verifyToken, getProgress);

// 更新学习进度
// POST /learning/progress/{lessonId}
// 请求头:
// Authorization: Bearer {token}
// 请求参数:
// {
//   "completed": "boolean, 是否完成该课时"
// }
router.post("/progress/:courseId/:lessonId/complete", verifyToken, markCompleted);


// 保存视频进度
// POST /learning/progress/{courseId}/{lessonId}/time
// 请求头:
// Authorization: Bearer {token}
router.post("/progress/:courseId/:lessonId/time", verifyToken, saveVideoProgress);

// 获取视频进度
// GET /learning/progress/{courseId}/{lessonId}/time
// 请求头:
// Authorization: Bearer {token}
router.get("/progress/:courseId/:lessonId/time", verifyToken, getVideoProgress);

// 获取最近学习进度
// GET /recent
// 请求头:
// Authorization: Bearer {token}
router.get("/recent", verifyToken, getRecentLearning);

// 获取学习进度历史
// GET /history
// 请求头:
// Authorization: Bearer {token}
router.get("/history", verifyToken, getHistoryLearning);

export default router;
