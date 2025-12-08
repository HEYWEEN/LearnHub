import express from "express";
import {
  createConversation,
  getConversation,
  getMessage,
  listConversations,
  sendMessage,
  deleteConversation,
} from "../controllers/aiController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/conversation", verifyToken, createConversation);

router.get("/conversation", verifyToken, listConversations);

// router.get("/conversation/:conversationId", verifyToken, getConversation);

// 通过conversationId获取消息记录
// GET /ai/conversation/:conversationId
// 请求头:
// Authorization: Bearer {token}
router.get("/conversation/:conversationId", verifyToken, getMessage);

// 发送消息到指定会话并获取AI回复
// POST /ai/conversation/:conversationId
// 请求头:
// Authorization: Bearer {token}
// 请求参数:
// {
//   "message": "string, 必填, 用户发送的消息内容"
// }
router.post("/conversation/:conversationId", verifyToken, sendMessage);

// 删除会话
// DELETE /ai/conversation/:conversationId
// 请求头:
// Authorization: Bearer {token}
router.delete("/conversation/:conversationId", verifyToken, deleteConversation);

export default router;
