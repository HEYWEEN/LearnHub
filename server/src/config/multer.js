import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import STATUS from "../constants/httpStatus.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 将上传目录定位到 /server/uploads（从当前 file 位置上溯两级）
const uploadDir = path.join(__dirname, "../../uploads");
// 确保目录存在
fs.mkdirSync(uploadDir, { recursive: true });

// 设置文件存储路径和文件名规则
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 使用原文件名并加上时间戳以避免文件名冲突
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// 只允许上传图片和视频，其他类型文件会被拒绝
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|mp4|mov|webm|mkv|m4v|flv|avi|ts|mpeg|mpg/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    const err =new Error(`文件格式不支持：${file.originalname}`);
    err.status = STATUS.BAD_REQUEST; 
    return cb(err, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

export default upload;
