// server/src/controllers/videoController.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/response.js";
import * as videoService from "../services/videoService.js";
import path from "path";
import { fileURLToPath } from "url";

const streamCoursePreview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const filePath = await videoService.getCourseVideoPath(courseId);
  // 直接流式响应（支持 Range）
  await videoService.streamFileByRange(filePath, req, res);
});

const streamLessonVideo = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const filePath = await videoService.getLessonVideoPath(lessonId);
  await videoService.streamFileByRange(filePath, req, res);
});

/**
 * 创建 HLS（如果你需要 HLS 播放）
 * POST /api/courses/:courseId/lessons/:lessonId/hls
 * 返回 { playlistUrl: '/uploads/hls/<id>/index.m3u8' }
 */
const createLessonHls = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const filePath = await videoService.getLessonVideoPath(lessonId);
  if (!filePath) {
    return sendError(res, "未找到源视频", 404);
  }
  try {
    const playlistAbsolute = await videoService.ensureHls(
      filePath,
      `lesson-${lessonId}`
    );
    // 将绝对路径转换为可访问 URL（uploads 已静态挂载）
    // 假设生成目录为 <server-root>/uploads/hls/<id>/index.m3u8
    // 我们返回 URL: /uploads/hls/<id>/index.m3u8
    const rel = playlistAbsolute.split("uploads").pop(); // "/hls/.../index.m3u8"
    const playlistUrl = `/uploads${rel}`;
    return sendSuccess(res, "HLS 生成完成", { playlistUrl });
  } catch (err) {
    return sendError(res, `HLS 生成失败: ${err.message}`, 500);
  }
});

export { streamCoursePreview, streamLessonVideo, createLessonHls };
