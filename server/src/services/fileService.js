import upload from "../config/multer.js";

// const uploadFile = (fileType) => {
//   return upload.single(fileType); // 动态决定上传文件类型
// };

// 提供文件的公共方法
const getUploadedFilePath = (file) => {
  return `/uploads/${file.filename}`; // 获取文件访问路径
};

const uploadFileAsync = (fileType) => {
  return (req, res, next) => {
    upload.single(fileType)(req, res, (err) => {
      if (err) {
        return next(err); // 如果上传失败，交给错误处理中间
      }
      next(); // 上传成功，继续处理
    });
  };
};

export default { getUploadedFilePath, uploadFileAsync };
