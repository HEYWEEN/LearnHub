import express from "express";

import verifyToken from "../middleware/authMiddleware.js";
import { addCourse, getCourseById, getCourses, modifyCourse, releaseReview, removeCourse } from "../controllers/courseController.js";
import { cancelEnrollCourse, enrollCourse } from "../controllers/enrollController.js";
import { addLesson, modifyLesson, removeLesson } from "../controllers/lessonController.js";
const router = express.Router();

//查询参数:
// page: number, 页码, 默认1
// limit: number, 每页数量, 默认12
// category: string, 分类筛选
// search: string, 搜索关键词
router.get("/", getCourses);

router.get("/:courseId", getCourseById);

//报名课程（student）
// 请求头:
// Authorization: Bearer {token}
router.post("/:courseId/enroll",verifyToken ,enrollCourse);

// POST /courses/{courseId}/cancel
router.post("/:courseId/cancel",verifyToken ,cancelEnrollCourse);

// 添加课程（teacher）
// POST /courses/
// 请求头:
// Authorization: Bearer {token}
router.post("/",verifyToken,addCourse);

// 删除课程（teacher）
// DELETE /courses/{courseId}
// 请求头:
// Authorization: Bearer {token}
router.delete("/:courseId",verifyToken,removeCourse);


// 修改课程信息（teacher）
// POST /courses/{courseId}
// 请求头:
// Authorization: Bearer {token}
router.post("/:courseId",verifyToken,modifyCourse);

// POST /courses/{courseId}/submit
router.post("/:courseId/lesson/submit",verifyToken,releaseReview)

// 删除课时（teacher）
// DELETE /courses/{courseId}/lesson/{lessonId}
// 请求头:
// Authorization: Bearer {token}
router.delete("/:courseId/lesson/:lessonId",verifyToken,removeLesson);


// 添加课时（teacher）
// POST /courses/{courseId}/lesson
// 请求头:
// Authorization: Bearer {token}
router.post("/:courseId/lesson",verifyToken,addLesson);


// 修改课程信息（teacher）
// POST /courses/{courseId}/lesson/{lessonId}
// 请求头:
// Authorization: Bearer {token}
router.post("/:courseId/lesson/:lessonId",verifyToken,modifyLesson);

export default router;
