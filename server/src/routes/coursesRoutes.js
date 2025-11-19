import express from "express";
import { addCourse, addLesson, enrollCourse, getCourseById, getCourses,modifyCourse,modifyLesson,removeCourse, removeLesson } from "../controllers/courseController.js";
import verifyToken from "../middleware/authMiddleware.js";
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
