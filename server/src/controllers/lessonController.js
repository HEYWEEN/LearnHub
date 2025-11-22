import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import * as lessonService from "../services/lessonService.js";

const addLesson = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const payload = req.body;
  const user = req.user;
  const lesson = await lessonService.addLesson({ user, courseId, payload });
  return sendSuccess(res, "章节添加成功", { lesson });
});

const removeLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const user = req.user;
  await lessonService.removeLesson({ user, lessonId });
  return sendSuccess(res, "章节删除成功", { lessonId, userId: user.id });
});

const modifyLesson = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.params;
  const payload = req.body;
  const user = req.user;
  const lessons = await lessonService.modifyLesson({
    user,
    courseId,
    lessonId,
    payload,
  });
  return sendSuccess(res, "章节修改成功", { lessons });
});

export { addLesson, removeLesson, modifyLesson };
