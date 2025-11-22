import getPool from "../config/db.js";
import STATUS from "../constants/httpStatus.js";
import { chatWithAi } from "../services/aiService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { v4 as uuidv4 } from "uuid";
import * as aiService from "../services/aiService.js";

const askAI = asyncHandler(async (req, res) => {
  const pool = getPool();
  //let { conversation_id = undefined } = req.params;
  let {
    question,
    context = null,
    think = false,
    conversation_id = null,
    course_id = null,
    lesson_id = null,
  } = req.body;
  let message = [{ role: "system", content: "You are a helpful assistant." }];
  let title = "new_title";
  if (conversation_id) {
    const [conversations] = await pool.query(
      "SELECT title,course_id,lesson_id FROM ai_conversation WHERE id = ?",
      [conversation_id]
    );
    if (conversations.length === 0) {
      const err = new Error("没有找到对话");
      err.status = STATUS.NOT_FOUND;
      throw err;
    }
    title = conversations[0].title;
    course_id = conversations[0].course_id;
    lesson_id = conversations[0].lesson_id;
    const [preMessages] = await pool.query(
      "SELECT sender,context FROM ai_messages WHERE conversation_id = ? ORDER BY send_at ASC",
      [conversation_id]
    );
    message = message.concat(
      preMessages.map((message) => {
        return {
          role: message.sender,
          content: message.context,
        };
      })
    );
  } else {
    conversation_id = uuidv4();
    const [row] = await pool.query(
      "INSERT INTO ai_conversation (id,title, user_id,course_id,lesson_id ) VALUES (?,?, ?, ?, ?)",
      [conversation_id, title, req.user.id, course_id, lesson_id]
    );
  }
  message.push({
    role: "user",
    content: question,
  });
  const answer = await chatWithAi(message, think);
  if (!answer) {
    return sendError(res, "获取回复失败");
  }
  await pool.query(
    "INSERT INTO ai_messages(id,conversation_id,sender,context) VALUES(UUID(),?,'user',?),(UUID(),?,'assistant',?)",
    [conversation_id, question, conversation_id, answer]
  );
  return sendSuccess(res, "获取回复成功", {
    message,
    answer,
    conversation_id,
    timestamp: new Date().toISOString(),
  });
});

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

export {
  askAI,
  getRecommendations,
  createConversation,
  listConversations,
  getConversation,
  sendMessage,
};
