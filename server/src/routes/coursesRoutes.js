import express from "express";
import { enrollCourse, getCourseById, getCourses, modifyCourse } from "../controllers/courseController.js";
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
router.post("/:courseId/enroll", enrollCourse);

// 添加/删除课程（teacher）
// POST /courses/{courseId}/teacher
// 请求头:
// Authorization: Bearer {token}
router.post("/:courseId/teacher",modifyCourse);

export default router;
