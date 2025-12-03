import upload from "../config/multer.js";
import STATUS from "../constants/httpStatus.js";
import ffmpeg from "fluent-ffmpeg";
import LOG_COLOR from "../constants/logColor.js";

// 获取视频时长，单位秒
const getVideoDuration = (filePath) =>{
  if(global.HAS_FFMPEG===false){
    console.warn(LOG_COLOR.FG_RED+ "[err]当前环境未安装 ffmpeg，无法获取视频时长" + LOG_COLOR.RESET);
    return Promise.resolve(0);
  }
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) return reject(err);
      const duration = data.format.duration; // 秒
      resolve(duration);
    });
  });
}

// 提供文件的公共方法
const getUploadedFilePath = (fileOrReq) => {
  // 接受直接传入的 file 对象，或传入 req（从 req.file 或 req.files 中取）
  const file =
    fileOrReq && fileOrReq.filename
      ? fileOrReq
      : fileOrReq && fileOrReq.file
      ? fileOrReq.file
      : null;
  if (!file) {
    const err = new Error("上传的文件未找到(req.file 为空)");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  return `/uploads/${file.filename}`; // 获取文件访问路径
};

// 返回会返回 Promise 的函数，方便用 await 等待上传完成
const uploadFileAsync = (fieldName) => {
  return (req, res) =>
    new Promise((resolve, reject) => {
      upload.single(fieldName)(req, res, (err) => {
        if (err) {
          return reject(err); // 如果上传失败，reject
        }
        // 上传成功，req.file 已被 multer 填充
        resolve(req.file);
      });
    });
};

export default { getUploadedFilePath, uploadFileAsync ,getVideoDuration};
