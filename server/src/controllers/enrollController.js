import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import * as enrollService from "../services/enrollService.js";

const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const user = req.user;
  const result = await enrollService.enrollCourse({ user, courseId });
  if (result.alreadyEnrolled) {
    return sendSuccess(res, "您已报名该课程", {
      enrollment: result.enrollment,
    });
  }
  return sendSuccess(res, "报名成功", { enrollment: result.enrollment });
});

const cancelEnrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const user = req.user;
  await enrollService.cancelEnrollCourse({ user, courseId });
  return sendSuccess(res, "退课成功", { userId: user.id, courseId });
});

const checkEnrollStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const user = req.user;
  const isEnrolled = await enrollService.checkEnrollStatus({ user, courseId });
  return sendSuccess(res, "查询成功", { isEnrolled });
});

export { enrollCourse, cancelEnrollCourse, checkEnrollStatus };
