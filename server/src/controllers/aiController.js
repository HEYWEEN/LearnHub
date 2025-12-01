import getPool from "../config/db.js";
import STATUS from "../constants/httpStatus.js";
import { chatWithAi } from "../services/aiService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { v4 as uuidv4 } from "uuid";
import * as aiService from "../services/aiService.js";

const getRecommendations = asyncHandler((req, res) => {
  const pool = getPool();
});

const createConversation = asyncHandler(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const conv = await aiService.createConversation({ user, payload });
  return sendSuccess(res, "会话创建成功", { conversation: conv });
});

const listConversations = asyncHandler(async (req, res) => {
  const user = req.user;
  const result = await aiService.listConversations({ user, query: req.query });
  return sendSuccess(res, "获取会话列表成功", result);
});

const getConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const result = await aiService.getConversation({
    conversationId,
    user: req.user,
  });
  return sendSuccess(res, "获取会话成功", result);
});

const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const payload = req.body;
  const message = await aiService.sendMessage({
    conversationId,
    user: req.user,
    payload,
  });
  return sendSuccess(res, "消息发送成功", { message });
});

const getMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const message = await aiService.getMessages({ conversationId, user: req.user , query: req.query});
  return sendSuccess(res, "获取消息成功", { message });
});

export {
  getMessage,
  getRecommendations,
  createConversation,
  listConversations,
  getConversation,
  sendMessage,
};
