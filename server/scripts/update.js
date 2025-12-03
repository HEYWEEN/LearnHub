import mysql from "mysql2/promise";
import dotenv from 'dotenv'

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

console.log("updating table structure...");


await pool.execute(`
    ALTER TABLE progress ADD COLUMN watch_time INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '已观看秒数'
`);

console.log("update complete.");

await pool.end();