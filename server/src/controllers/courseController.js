import pool from "../config/db.js";
import STATUS from "../constants/httpStatus.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const getCourses = asyncHandler(async (req, res) =>{
    const {
        page = 1,
        limit = 12,
        category,
        search = ""
    } = req.body;
    const [row] = await pool.query(
        'SELECT *'/
        'FROM courses'/
        'WHERE category=?'/
        'LIMIT ?,?'

    );
});
(req, res) => {
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
}

const getCourseById = asyncHandler(async(req,res)=>{
    const {courseId} = req.params;
    console.log(courseId);
    const [courseRow] = await pool.query(
        'SELECT * FROM courses WHERE id=?',
        [courseId]
    );
    if(courseRow.length===0){
        const err = new Error('没有找到课程');
        err.status = STATUS.NOT_FOUND;
        return err;
    }
    const course = courseRow[0];
    const [lessonRow] = await pool.query(
        'SELECT * FROM lessons WHERE course_id=?',
        [courseId]
    );
    const [reviewRow] = await pool.query(
        'SELECT * FROM reviews WHERE course_id=?',
        [courseId]
    );
    return sendSuccess(res,'成功找到课程',{
        course:{
            ...course,
            lessons:lessonRow,
            reviews:reviewRow
        }
    });
});

const enrollCourse = asyncHandler(async(req,res)=>{
    const {courseId} = req.params;
});(req, res) => {
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
};

const modifyCourse = (req, res) => {
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
};

export { getCourses, getCourseById, enrollCourse, modifyCourse };