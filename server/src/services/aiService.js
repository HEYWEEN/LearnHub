import * as aiRepo from "../repository/aiRepository.js";
import { v4 as uuidv4 } from "uuid";
import STATUS from "../constants/httpStatus.js";
import OpenAI from "openai";
import {
  withConnection,
  withTransaction,
} from "../repository/transactionRepository.js";
import LOG_COLOR from "../constants/logColor.js";

export async function createConversation({ user, payload }) {
  const id = uuidv4();
  const conv = await withTransaction(async (conn) => {
    await aiRepo.createConversation(conn, {
      id,
      title: payload.title || null,
      user_id: user?.id || null,
      course_id: payload.courseId || null,
    });
    return await aiRepo.findConversationById(conn, id);
  });
  return conv;
}

export async function listConversations({ user, query }) {
  const { page = 1, limit = 20 } = query || {};

  const rows = await withConnection(
    async (conn) =>
      await aiRepo.listConversationsByUser(conn, user.id, { page, limit })
  );
  return {
    conversations: rows,
    pagination: { page: Number(page), limit: Number(limit) },
  };
}

// export async function getConversation({ conversationId, user }) {
//   const conv = await withConnection(
//     async (conn) => await aiRepo.findConversationById(conversationId)
//   );
//   if (!conv) {
//     const e = new Error("会话不存在");
//     e.status = STATUS.NOT_FOUND;
//     throw e;
//   }
//   // 可加权限检查：只有创建者或管理员可查看
//   return conv;
// }

export async function sendMessage({ conversationId, user, payload }) {
  return await withTransaction(async (conn) => {
    const conv = await aiRepo.findConversationById(conn, conversationId);
    if (!conv) {
      const e = new Error("会话不存在");
      e.status = STATUS.NOT_FOUND;
      throw e;
    }
    let message = [{ role: "system", content: "You are a helpful assistant." }];
    const preMessages = await aiRepo.listRecentMessages(conn, conversationId);
    const question = payload.text || "";
    message = message.concat(
      preMessages.map((message) => {
        return {
          role: message.sender,
          content: message.context,
        };
      })
    );

    message.push({
      role: "user",
      content: question,
    });
    const answer = await chatWithAi(message, false);
    if (!answer) {
      const err = new Error("获取回复失败");
      err.status = STATUS.INTERNAL_SERVER_ERROR;
      throw err;
    }
    const id1 = uuidv4();
    const id2 = uuidv4();
    await aiRepo.insertMessage(conn, {
      id: id1 > id2 ? id1 : id2,
      conversation_id: conversationId,
      sender: payload.sender || "user",
      context: payload.text || "",
    });
    await aiRepo.insertMessage(conn, {
      id: id1 < id2 ? id1 : id2,
      conversation_id: conversationId,
      sender: "assistant",
      context: answer,
    });
    return { answer };
  });
}

export async function getMessages({ conversationId, user, query }) {
  const { page = 1, limit = 20 } = query || {};
  const [rows, total] = await withConnection(async (conn) =>
    Promise.all([
      aiRepo.listMessages(conn, conversationId, { page, limit }),
      aiRepo.countMessages(conn, conversationId),
    ])
  );
  return {
    messages: rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function deleteConversation({ conversationId, user }) {
  return await withTransaction(async (conn) => {
    const conv = await aiRepo.findConversationById(conn, conversationId);
    if (!conv) {
      const e = new Error("会话不存在");
      e.status = STATUS.NOT_FOUND;
      throw e;
    }
    if (conv.user_id !== user.id && user.role !== "admin") {
      const e = new Error("没有权限删除该会话");
      e.status = STATUS.FORBIDDEN;
      throw e;
    }
    await aiRepo.deleteMessagesByConversation(conn, conversationId);
    await aiRepo.deleteConversation(conn, conversationId);
    return;
  });
}

export async function chatWithAi(messages, think = false) {
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
