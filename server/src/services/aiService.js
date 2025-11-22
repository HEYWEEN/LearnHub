import * as aiRepo from "../repository/aiRepository.js";
import { v4 as uuidv4 } from "uuid";
import STATUS from "../constants/httpStatus.js";

export async function createConversation({ user, payload }) {
  const id = uuidv4();
  await aiRepo.createConversation({
    id,
    title: payload.title || null,
    user_id: user?.id || null,
    course_id: payload.courseId || null,
  });
  const conv = await aiRepo.findConversationById(id);
  return conv;
}

export async function listConversations({ user, query }) {
  const { page = 1, limit = 20 } = query || {};
  const rows = await aiRepo.listConversationsByUser(user.id, { page, limit });
  return {
    conversations: rows,
    pagination: { page: Number(page), limit: Number(limit) },
  };
}

export async function getConversation({ conversationId, user }) {
  const conv = await aiRepo.findConversationById(conversationId);
  if (!conv) {
    const e = new Error("会话不存在");
    e.status = STATUS.NOT_FOUND;
    throw e;
  }
  // 可加权限检查：只有创建者或管理员可查看
  return conv;
}

export async function sendMessage({ conversationId, user, payload }) {
  const conv = await aiRepo.findConversationById(conversationId);
  if (!conv) {
    const e = new Error("会话不存在");
    e.status = STATUS.NOT_FOUND;
    throw e;
  }
  const id = uuidv4();
  await aiRepo.insertMessage({
    id,
    conversation_id: conversationId,
    sender: payload.sender || "user",
    context: payload.text || "",
  });
  const message = {
    id,
    conversation_id: conversationId,
    sender: payload.sender || "user",
    context: payload.text || "",
    send_at: new Date(),
  };
  return message;
}

import OpenAI from "openai";
import LOG_COLOR from "../constants/logColor.js";

async function chatWithAi(messages, think = false) {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error(
      LOG_COLOR.FG_RED + "[err] 未设置API_KEY,无法开启ai功能" + LOG_COLOR.RESET
    );
    return undefined;
  }
  const model = {
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
    name: think ? "deepseek-reasoner" : "deepseek-chat",
  };
  const openai = new OpenAI({
    baseURL: model.baseURL,
    apiKey: model.apiKey,
  });
  const completion = await openai.chat.completions.create({
    messages,
    model: model.name,
  });
  return completion.choices[0].message.content;
}

export { chatWithAi };
