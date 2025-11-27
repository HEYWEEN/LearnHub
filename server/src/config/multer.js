import multer from 'multer';
import path from 'path';

// 设置文件存储路径和文件名规则
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads'); // 存储文件的路径
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 使用原文件名并加上时间戳以避免文件名冲突
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// 只允许上传图片和视频，其他类型文件会被拒绝
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|mp4|avi/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('只支持图片和视频文件！'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

export default upload;