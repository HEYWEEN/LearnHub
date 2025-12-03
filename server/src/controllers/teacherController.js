import { asyncHandler } from "../utils/asyncHandler.js";
import * as enrollService from "../services/enrollService.js";
import * as teacherService from "../services/teacherServices.js";
import * as learningService from "../services/learningService.js";
import { sendSuccess } from "../utils/response.js";

const getStudentProgress = asyncHandler(async (req, res) => {
  const { studentId,courseId } = req.params;
  const data = await learningService.getCourseLearning({ user:{id:studentId}, courseId });
  return sendSuccess(res, "获取学生课程学习数据成功", data);
});

const listEnrollments = asyncHandler(async (req, res) => {
  const user = req.user;
  const enrollments = await enrollService.listEnrollments({ user });
  return sendSuccess(res, "查询成功", { enrollments });
});

const getCourseByTeacherId = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category = "", search = "" } = req.query;
  const user = req.user;
  const result = await teacherService.getCourseByTeacherId({
    instructor_id: user.id,
    page,
    limit,
    category,
    search,
  });
  return sendSuccess(res, "成功找到课程", result);
});

const getStatistics = asyncHandler(async (req, res) => {
  const user = req.user;
  const statistics = await teacherService.getStatistics({
    instructor_id: user.id,
  });
  return sendSuccess(res, "获取数据成功", { statistics });
});

export {
  listEnrollments,
  getCourseByTeacherId,
  getStatistics,
  getStudentProgress,
};
