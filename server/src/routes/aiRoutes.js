import express from 'express';
import { askAI } from '../controllers/aiController.js';
import verifyToken from "../middleware/authMiddleware.js";
const router = express.Router();

/* 智能问答
* POST /ai/ask
* 请求头:
* Authorization: Bearer {token}
* 请求参数:
* {
*   "question": "string, 必填, 问题内容",
*   "context": {
*     "courseId": "string, 选填, 相关课程ID",
*     "lessonId": "string, 选填, 相关课时ID"
*   }
* }
* 成功响应:
* {
*   "success": true,
*   "data": {
*     "answer": "React是一个用于构建用户界面的JavaScript库...",
*     "sources": ["React官方文档", "课程第三章"],
*     "timestamp": "2024-01-15T11:35:00Z"
*   },
*   "code": 200
* }
*/
router.post("/ask", verifyToken,askAI);

// 获取学习推荐
// GET /ai/recommendations
// 请求头:
// Authorization: Bearer {token}
// 成功响应:
// {
//   "success": true,
//   "data": {
//     "recommendations": [
//       {
//         "courseId": "course_456",
//         "title": "Vue.js实战教程",
//         "coverImage": "/covers/vue-course.jpg",
//         "reason": "基于你的React学习经历推荐",
//         "matchScore": 0.85
//       }
//     ]
//   },
//   "code": 200
// }
router.get("/recommendations", (req, res) => {
  res.json({
    success: true,
    data: {
      recommendations: [
        {
          courseId: "course_456",
          title: "Vue.js实战教程",
          coverImage: "/covers/vue-course.jpg",
          reason: "基于你的React学习经历推荐",
          matchScore: 0.85,
        },
      ],
    },
    code: 200,
  });
});

export default router;
