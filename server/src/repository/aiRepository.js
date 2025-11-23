import getPool from "../config/db.js";

export async function createConversation({
  id,
  title,
  user_id,
  course_id = null,
}) {
  const pool = getPool();
  const sql = `INSERT INTO ai_conversation (id, title, user_id, course_id, created_at) VALUES (?, ?, ?, ?, NOW())`;
  await pool.query(sql, [id, title || null, user_id || null, course_id]);
}

export async function listConversationsByUser(
  userId,
  { page = 1, limit = 20 } = {}
) {
  const pool = getPool();
  const offset = (Number(page) - 1) * Number(limit);
  const [rows] = await pool.query(
    `SELECT * FROM ai_conversation WHERE user_id = ? ORDER BY created_at DESC LIMIT ?, ?`,
    [userId, offset, Number(limit)]
  );
  return rows;
}

export async function findConversationById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM ai_conversation WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function insertMessage({ id, conversation_id, sender, context }) {
  const pool = getPool();
  const sql = `INSERT INTO ai_messages (id, conversation_id, sender, context, send_at) VALUES (?, ?, ?, ?, NOW())`;
  await pool.query(sql, [id, conversation_id, sender, context]);
}

export async function listMessages(conversationId) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY send_at`,
    [conversationId]
  );
  return rows;
}
