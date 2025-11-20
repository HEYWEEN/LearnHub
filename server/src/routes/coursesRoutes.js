<<<<<<< HEAD
const express = require("express");
=======
import express from "express";
import { addCourse, addLesson, enrollCourse, getCourseById, getCourses,modifyCourse,modifyLesson,removeCourse, removeLesson } from "../controllers/courseController.js";
import verifyToken from "../middleware/authMiddleware.js";
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
const router = express.Router();

//查询参数:
// page: number, 页码, 默认1
// limit: number, 每页数量, 默认12
// category: string, 分类筛选
// search: string, 搜索关键词
<<<<<<< HEAD
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      courses: [
        {
          id: "course_123",
          title: "React从入门到实战",
          description: "学习React核心概念和实战技巧",
          coverImage: "/covers/react-course.jpg",
          instructor: {
            id: "user_456",
            name: "王老师",
            avatar: "/avatars/instructor456.jpg",
          },
          category: "前端开发",
          lessonCount: 24,
        },
      ],
      pagination: {
        page: 1,
        limit: 12,
        total: 156,
        pages: 13,
      },
    },
    code: 200,
  });
});

router.get("/:courseId", (req, res) => {
  const { courseId } = req.params;
  res.json({
    success: true,
    data: {
      course: {
        id: "course_123",
        title: "React从入门到实战",
        description: "详细描述...",
        coverImage: "/covers/react-course.jpg",
        videoPreview: "/previews/react-preview.mp4",
        instructor: {
          id: "user_456",
          name: "王老师",
          avatar: "/avatars/instructor456.jpg",
          bio: "资深前端工程师，8年开发经验",
        },
        category: "前端开发",
        lessons: [
          {
            id: "lesson_1",
            title: "React基础概念",
            duration: 1800,
            videoUrl: "/videos/lesson1.mp4",
            isFree: true,
            description: "学习React核心概念",
          },
        ],
        reviews: [
          {
            id: "review_1",
            user: {
              name: "学生A",
              avatar: "/avatars/student1.jpg",
            },
            comment: "课程内容很棒！",
            createdAt: "2024-01-10T14:30:00Z",
          },
        ],
      },
    },
    code: 200,
  });
});
=======
router.get("/", getCourses);

router.get("/:courseId", getCourseById);
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653

//报名课程（student）
// 请求头:
// Authorization: Bearer {token}
<<<<<<< HEAD
router.post("/:courseId/enroll", (req, res) => {
  const { courseId } = req.params;
  res.json({
    success: true,
    message: "报名成功",
    data: {
      enrollment: {
        id: "enroll_123",
        userId: "user_123",
        courseId: "course_123",
      },
    },
    code: 200,
  });
});

// 添加/删除课程（teacher）
// POST /courses/{courseId}/teacher
// 请求头:
// Authorization: Bearer {token}
router.post("/:courseId/teacher", (req, res) => {
  const { courseId } = req.params;
  res.json({
    success: true,
    message: "添加成功",
    data: {
      addition: {
        id: "addition_123",
        userId: "user_123",
        courseId: "course_123",
      },
    },
    code: 200,
  });
  res.json({
    success: true,
    message: "删除成功",
    data: {
      deletion: {
        id: "deletion_123",
        userId: "user_123",
        courseId: "course_123",
      },
    },
    code: 200,
  });
});

module.exports = router;
=======
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
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
