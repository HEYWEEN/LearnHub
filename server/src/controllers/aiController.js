import getPool from "../config/db.js";
import STATUS from "../constants/httpStatus.js";
import { chatWithAi } from "../services/aiService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/response.js";
import {v4 as uuidv4 } from 'uuid';

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
  }
  else{
    conversation_id = uuidv4();
    const [row] = await pool.query(
      "INSERT INTO ai_conversation (id,title, user_id,course_id,lesson_id ) VALUES (?,?, ?, ?, ?)",[conversation_id,title,req.user.id,course_id,lesson_id]
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
    "INSERT INTO ai_messages(id,conversation_id,sender,context) VALUES(UUID(),?,'user',?),(UUID(),?,'assistant',?)",[conversation_id,question,conversation_id,answer]
  );
  return sendSuccess(res,"获取回复成功",{
    message,
    answer,
    conversation_id,
    timestamp: new Date().toISOString(),
  });
});

const getRecommendations = asyncHandler((req, res) => {
  const pool = getPool();
});

export { askAI, getRecommendations };
