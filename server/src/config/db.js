//src/config/db.js
import mysql from "mysql2/promise";
import LOG_COLOR from "../constants/logColor.js";

let pool = null;

export const connectDB = async () => {
  if (pool) return pool;
  try {
    const cfg = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      waitForConnections: true,
      connectionLimit: 10,
    };
    pool = mysql.createPool(cfg);
    // 主动测试连接可用性
    const conn = await pool.getConnection();
    try {
      await conn.query("SELECT 1");
    } finally {
      conn.release();
    }
    console.log(LOG_COLOR.FG_GREEN + "[info] 数据库连接成功" + LOG_COLOR.RESET);
    return pool;
  } catch (err) {
    pool = null;
    console.error(
      LOG_COLOR.FG_RED +
        "[err] 数据库连接失败: " +
        (err && err.message ? err.message : String(err)) +
        LOG_COLOR.RESET
    );
    throw err;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error(
      LOG_COLOR.FG_RED +
        "[err] 数据库未连接, 请先调用 connectDB()" +
        LOG_COLOR.RESET
    );
  }
  return pool;
};

export default getPool;
