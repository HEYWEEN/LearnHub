<<<<<<< HEAD
const express = require("express");
=======
import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { getProgress, updateProgress } from "../controllers/learningController.js";
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
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
<<<<<<< HEAD
router.get("/progress/:courseId", (req, res) => {
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
=======
router.get("/progress/:courseId", verifyToken ,getProgress);
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653

// 更新学习进度
// POST /learning/progress/{lessonId}
// 请求头:
// Authorization: Bearer {token}
// 请求参数:
// {
//   "completed": "boolean, 是否完成该课时"
// }
<<<<<<< HEAD
router.post("/progress/:lessonId", (req, res) => {
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

module.exports = router;
=======
router.post("/progress/:lessonId", verifyToken,updateProgress);

export default router;
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
