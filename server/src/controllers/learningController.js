import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import * as learningService from "../services/learningService.js";

const getProgress = asyncHandler(async (req, res) => {
  const user = req.user;
  const { courseId } = req.params;
  const progress = await learningService.getProgress({ user, courseId });
  return sendSuccess(res, "获取学习进度成功", { progress });
});

const markCompleted = asyncHandler(async (req, res) => {
  const user = req.user;
  const { courseId, lessonId } = req.params;
  const result = await learningService.markCompleted({
    user,
    courseId,
    lessonId,
  });
  return sendSuccess(res, "标记完成成功", result);
});

const getCourseLearning = asyncHandler(async (req, res) => {
  const user = req.user;
  const { courseId } = req.params;
  const data = await learningService.getCourseLearning({ user, courseId });
  return sendSuccess(res, "获取课程学习数据成功", data);
});

const getRecentLearning = asyncHandler(async (req,res)=>{
  const user = req.user;
  const { page = 1, limit = 12} = req.query;
  const data = await learningService.getRecentLearning({user,page,limit});
  return sendSuccess(res,"获取学习数据成功",data);
})

export { getProgress, markCompleted, getCourseLearning,getRecentLearning };
