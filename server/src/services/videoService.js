// server/src/services/videoService.js
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import mime from "mime"; // 在粘贴后请确保安装：npm i mime
import * as coursesRepo from "../repository/coursesRepository.js";
import * as lessonsRepo from "../repository/lessonRepository.js";
import { withConnection } from "../repository/transactionRepository.js";
import { sendError } from "../utils/response.js";
import STATUS from "../constants/httpStatus.js";

const UPLOADS_DIR = path.join(process.cwd(), "uploads"); // 以运行目录为准（通常为 server 根）

function normalizeStoredPath(stored) {
  if (!stored) return null;
  // 支持： "/uploads/xxx", "uploads/xxx", absolute path
  if (stored.startsWith("/")) stored = stored.slice(1);
  if (path.isAbsolute(stored)) return stored;
  return path.join(process.cwd(), stored);
}

export async function getCourseVideoPath(courseId) {
  const course = await withConnection((conn) =>
    coursesRepo.findCourseById(conn, courseId)
  );
  if (!course) return null;
  const stored = course.video_preview || course.video || null;
  return stored ? normalizeStoredPath(stored) : null;
}

export async function getLessonVideoPath(lessonId) {
  const lesson = await withConnection((conn) =>
    lessonsRepo.findLessonById(conn, lessonId)
  );
  if (!lesson) return null;
  const stored = lesson.video_url || lesson.video || null;
  return stored ? normalizeStoredPath(stored) : null;
}

/**
 * 基于 HTTP Range 的流式传输
 * - filePath: 本地文件绝对路径
 * - req, res: express request/response
 */
export async function streamFileByRange(filePath, req, res) {
  if (!filePath) {
    const err = new Error("视频文件未配置");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }

  // 文件是否存在
  let stats;
  try {
    stats = await fs.promises.stat(filePath);
    if (!stats.isFile()){ 
      throw new Error("不是文件");
    }
  } catch (err) {
    const Err = new Error("视频文件未找到:"+filePath);
    Err.status = STATUS.NOT_FOUND;
    throw Err;
  }

  const fileSize = stats.size;
  const range = req.headers.range;
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mime.getType(ext) || "application/octet-stream";

  if (!range) {
    // 没有 range，直接返回完整文件（注意：大文件可能无法一次性加载）
    res.writeHead(STATUS.OK, {
      "Content-Length": fileSize,
      "Content-Type": contentType,
      AcceptRanges: "bytes",
    });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on("error", (err) => {
      res.destroy(err);
    });
    return;
  }

  // 解析 range，格式： bytes=start-end
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  if (isNaN(start) || isNaN(end) || start > end || end >= fileSize) {
    res
      .status(416)
      .set({
        "Content-Range": `bytes */${fileSize}`,
      })
      .end();
    return;
  }

  const chunkSize = end - start + 1;
  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": contentType,
  });

  const stream = fs.createReadStream(filePath, { start, end });
  stream.pipe(res);
  stream.on("error", (err) => {
    res.destroy(err);
  });
}

/**
 * 使用 ffmpeg 生成 HLS（m3u8 + ts segments）
 * - inputPath: 源视频绝对路径
 * - id: 用于命名输出目录（使用 lessonId/courseId）
 * 返回 m3u8 相对/绝对路径（可直接在浏览器播放）
 *
 * 注意：需要系统上安装 ffmpeg
 */
export async function ensureHls(inputPath, id) {
  if (!inputPath) throw new Error("missing inputPath");
  const outDir = path.join(UPLOADS_DIR, "hls", String(id));
  const playlist = path.join(outDir, "index.m3u8");

  // 如果已存在 playlist，直接返回
  try {
    const stat = await fs.promises.stat(playlist);
    if (stat && stat.isFile()) {
      return playlist;
    }
  } catch (err) {
    // 不存在，继续生成
  }

  // 确保输出目录
  await fs.promises.mkdir(outDir, { recursive: true });

  // ffmpeg 参数：输出 HLS 适配大多数播放器
  // -hls_time 10 => 每段 10 秒； -hls_list_size 0 => 保存所有片段（VOD）
  const args = [
    "-y",
    "-i",
    inputPath,
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-strict",
    "-2",
    "-preset",
    "veryfast",
    "-g",
    "48",
    "-sc_threshold",
    "0",
    "-b:v",
    "2000k",
    "-maxrate",
    "2140k",
    "-bufsize",
    "3000k",
    "-hls_time",
    "10",
    "-hls_list_size",
    "0",
    "-hls_segment_filename",
    path.join(outDir, "seg_%03d.ts"),
    playlist,
  ];

  // spawn ffmpeg
  await new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", args, {
      stdio: ["ignore", "inherit", "inherit"],
    });
    proc.on("error", (err) => reject(err));
    proc.on("close", (code) => {
      if (code === 0) return resolve();
      return reject(new Error(`ffmpeg exit code ${code}`));
    });
  });

  return playlist;
}
