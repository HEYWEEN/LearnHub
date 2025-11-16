import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
const router = express.Router();

// 获取学习进度
// GET /learning/progress/{courseId}
// 请求头:
// Authorization: Bearer {token}
// 成功响应:
// {
//   "success": true,
//   "data": {
//     "progress": {
//       "courseId": "course_123",
//       "completedLessons": ["lesson_1", "lesson_2"],
//       "lastLessonId": "lesson_3"
//     }
//   },
//   "code": 200
// }
router.get("/progress/:courseId", verifyToken ,(req, res) => {
  res.json({
    success: true,
    data: {
      progress: {
        courseId: "course_123",
        completedLessons: ["lesson_1", "lesson_2"],
        lastLessonId: "lesson_3",
      },
    },
    code: 200,
  });
});

// 更新学习进度
// POST /learning/progress/{lessonId}
// 请求头:
// Authorization: Bearer {token}
// 请求参数:
// {
//   "completed": "boolean, 是否完成该课时"
// }
router.post("/progress/:lessonId", verifyToken,(req, res) => {
  res.json({
    success: true,
    message: "进度更新成功",
    data: {
      progress: {
        lessonId: "lesson_3",
        completed: true,
      },
    },
    code: 200,
  });
});

export default router;
