import express from "express";
const router = express.Router();

//req
//请求头 Authorization: Bearer {token}
router.get("/profile", (req, res) => {
  res.json({
    success: true,
    data: {
      id: "user_123",
      username: "刘小峰",
      email: "xiaofengliu@example.com",
      avatar: "/avatars/avatar123.jpg",
      bio: "热爱学习的前端开发者",
    },
    code: 200,
  });
});

//req
//请求头 Authorization: Bearer {token}
//请求参数:
// {
//   "username": "string, 选填",
//   "avatar": "string, 选填, 头像URL",
//   "bio": "string, 选填, 个人简介"
// }
router.put("/profile", (req, res) => {
  res.json({
    success: true,
    message: "资料更新成功",
    data: {
      user: {
        id: "user_123",
        username: "石头",
        avatar: "/avatars/new_avatar.jpg",
        bio: "更新后的个人简介",
      },
    },
    code: 200,
  });
});

export default router;
