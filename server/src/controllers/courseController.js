import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import * as courseService from "../services/courseService.js";
import fileService from "../services/fileService.js";

const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category = "", search = "" } = req.query;
  const result = await courseService.getCourses({
    page,
    limit,
    category,
    search,
  });
  return sendSuccess(res, "成功获取课程列表", result);
});

const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const result = await courseService.getCourseById({ courseId });
  return sendSuccess(res, "成功找到课程", result);
});

const addCourse = asyncHandler(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const course = await courseService.addCourse({ user, payload });
  return sendSuccess(res, "课程添加成功", course );
});

const removeCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const user = req.user;
  await courseService.removeCourse({ user, courseId });
  return sendSuccess(res, "课程删除成功", { courseId, userId: user.id });
});

const modifyCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const payload = req.body;
  const user = req.user;
  const updated = await courseService.modifyCourse({ user, courseId, payload });
  return sendSuccess(res, "课程修改成功", { course: updated });
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const user = req.user;
  const { courseId } = req.params;
  // 文件上传
  const file = await fileService.uploadFileAsync("image")(req, res);
  // 获取上传后的文件路径
  const coverImageUrl = fileService.getUploadedFilePath(file);
  // 更新课程封面
  const updated = await courseService.modifyCourse({
    user,
    courseId,
    payload: { cover_image: coverImageUrl },
  });
  return sendSuccess(res, "封面更新成功", { course: updated });
});

const releaseReview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const user = req.user;
  const { comment, rating, parentId = null } = req.body;
  const newComment = await courseService.releaseReview({
    courseId,
    user,
    content:comment,
    rating,
    parentId,
  });
  return sendSuccess(res, "评论发表成功", newComment);
});

export {
  getCourses,
  getCourseById,
  addCourse,
  removeCourse,
  modifyCourse,
  releaseReview,
  updateCoverImage
};
