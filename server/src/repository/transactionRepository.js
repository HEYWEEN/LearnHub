import getPool from "../config/db.js";

const withTransaction = async (callback) => {
  const pool = getPool();
  const conn = await pool.getConnection(); // 必须 await
  try {
    await conn.beginTransaction();
    // 回调中应使用同一个 connection(conn) 执行所有查询
    const res = await callback(conn);
    await conn.commit();
    return res;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const withConnection = async (callback) => {
  const pool = getPool();
  // 对于非事务操作，直接传入 pool 即可（保证回调内正确使用）
  return await callback(pool);
};

export { withConnection, withTransaction };