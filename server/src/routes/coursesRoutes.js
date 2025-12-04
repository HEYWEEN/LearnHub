import express from "express";
import { authorize, verifyToken } from "../middleware/authMiddleware.js";
import {
  addCourse,
  getCourseById,
  getCourses,
  modifyCourse,
  releaseReview,
  removeCourse,
  updateCoverImage,
  updateVideoPreview,
  
} from "../controllers/courseController.js";
import {
  cancelEnrollCourse,
  enrollCourse,
  checkEnrollStatus
} from "../controllers/enrollController.js";
import {
  addLesson,
  getLesson,
  modifyLesson,
  removeLesson,
  updateVideo,
} from "../controllers/lessonController.js";
import {
  createLessonHls,
  streamCoursePreview,
  streamLessonVideo,
} from "../controllers/videoController.js";
const router = express.Router();

//查询参数:
// page: number, 页码, 默认1
// limit: number, 每页数量, 默认12
// category: string, 分类筛选
// search: string, 搜索关键词
router.get("/", getCourses);

// 添加课程（teacher）
// POST /courses/
// 请求头:
// Authorization: Bearer {token}
router.post("/", verifyToken, authorize(["teacher", "admin"]), addCourse);

// 修改课程信息（teacher）
// POST /courses/{courseId}
// 请求头:
// Authorization: Bearer {token}
router.post(
  "/:courseId",
  verifyToken,
  authorize(["teacher", "admin"]),
  modifyCourse
);

// 删除课程（teacher）
// DELETE /courses/{courseId}
// 请求头:
// Authorization: Bearer {token}
router.delete(
  "/:courseId",
  verifyToken,
  authorize(["teacher", "admin"]),
  removeCourse
);

router.get("/:courseId", getCourseById);

// 检测报名状态（student）
// GET /courses/{courseId}/enrollment-status
// 请求头:
// Authorization: Bearer {token}
router.get("/:courseId/enrollment-status", verifyToken, checkEnrollStatus);

//报名课程（student）
// 请求头:
// Authorization: Bearer {token}
router.post("/:courseId/enroll", verifyToken, enrollCourse);

// POST /courses/{courseId}/cancel
router.post("/:courseId/cancel", verifyToken, cancelEnrollCourse);


// 修改课程封面（teacher）
// POST /courses/{courseId}/cover-img
// 请求头:
// Authorization: Bearer {token}
router.post(
  "/:courseId/cover-img",
  verifyToken,
  authorize(["teacher", "admin"]),
  updateCoverImage
);

// 修改课程导览视频（teacher）
// POST /courses/{courseId}/video-preview
// 请求头:
// Authorization: Bearer {token}
router.post(
  "/:courseId/video-preview",
  verifyToken,
  authorize(["teacher", "admin"]),
  updateVideoPreview
);

router.get("/:courseId/video-preview", streamCoursePreview);

// POST /courses/{courseId}/review
router.post("/:courseId/reviews", verifyToken, releaseReview);

// 删除课时（teacher）
// DELETE /courses/{courseId}/lesson/{lessonId}
// 请求头:
// Authorization: Bearer {token}
router.delete(
  "/:courseId/lesson/:lessonId",
  verifyToken,
  authorize(["teacher", "admin"]),
  removeLesson
);

// 获取课时
// GET /courses/{courseId}/lesson/
router.get("/:courseId/lesson", getLesson);

// 添加课时（teacher）
// POST /courses/{courseId}/lesson
// 请求头:
// Authorization: Bearer {token}
router.post(
  "/:courseId/lesson",
  verifyToken,
  authorize(["teacher", "admin"]),
  addLesson
);

router.get("/:courseId/lesson/:lessonId/stream", streamLessonVideo);

router.post("/:courseId/lesson/:lessonId/hls", createLessonHls);

// 修改课程信息（teacher）
// POST /courses/{courseId}/lesson/{lessonId}
// 请求头:
// Authorization: Bearer {token}
router.post(
  "/:courseId/lesson/:lessonId",
  verifyToken,
  authorize(["teacher", "admin"]),
  modifyLesson
);

// 修改章节视频（teacher）
// POST /courses/{courseId}/video-preview
// 请求头:
// Authorization: Bearer {token}
router.post(
  "/:courseId/lesson/:lessonId/video",
  verifyToken,
  authorize(["teacher", "admin"]),
  updateVideo
);

export default router;
