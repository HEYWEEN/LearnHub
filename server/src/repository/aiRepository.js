import getPool from "../config/db.js";

export async function createConversation(pool,{
  id,
  title,
  user_id,
  course_id = null,
}) {
  const sql = `INSERT INTO ai_conversation (id, title, user_id, course_id, created_at) VALUES (?, ?, ?, ?, NOW())`;
  await pool.query(sql, [id, title || null, user_id || null, course_id]);
}

export async function listConversationsByUser(
  pool,userId,
  { page = 1, limit = 20 } = {}
) {
  const offset = (Number(page) - 1) * Number(limit);
  const [rows] = await pool.query(
    `SELECT * FROM ai_conversation WHERE user_id = ? ORDER BY created_at DESC LIMIT ?, ?`,
    [userId, offset, Number(limit)]
  );
  return rows;
}

export async function findConversationById(pool,id) {
  const [rows] = await pool.query(
    `SELECT * FROM ai_conversation WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function insertMessage(pool,{ id, conversation_id, sender, context }) {
  const sql = `INSERT INTO ai_messages (id, conversation_id, sender, context, send_at) VALUES (?, ?, ?, ?, NOW())`;
  await pool.query(sql, [id, conversation_id, sender, context]);
}

export async function listMessages(pool,conversationId,{ page = 1, limit = 50 }) {
  const offset = (Number(page) - 1) * Number(limit);
  const [rows] = await pool.query(
    `SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY send_at ASC, id DESC LIMIT ?, ?`,
    [conversationId, offset, Number(limit)]
  );
  return rows;
}

export async function listRecentMessages(pool,conversationId, limit = 100) {
  const [rows] = await pool.query(
    `SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY send_at DESC, id DESC LIMIT ?`,
    [conversationId, Number(limit)]
  );
  return rows.reverse();
}

export async function updateConversationTitle(pool,conversationId, title) {
  const sql = `UPDATE ai_conversation SET title = ? WHERE id = ?`;
  await pool.query(sql, [title, conversationId]);
}

export async function deleteConversation(pool,conversationId) {
  const sqlConversation = `DELETE FROM ai_conversation WHERE id = ?`;
  await pool.query(sqlConversation, [conversationId]);
}

export async function deleteMessagesByConversation(pool,conversationId) {
  const sqlMessages = `DELETE FROM ai_messages WHERE conversation_id = ?`;
  await pool.query(sqlMessages, [conversationId]);
}

export async function countUserConversations(pool,userId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM ai_conversation WHERE user_id = ?`,
    [userId]
  );
  return rows[0].count;
}

export async function countMessages(pool,conversationId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM ai_messages WHERE conversation_id = ?`,
    [conversationId]
  );
  return rows[0].count;
}

