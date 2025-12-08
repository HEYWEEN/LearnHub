/**
 * cleanupUploads.js
 * 自动清理 uploads 下未被数据库引用的垃圾文件
 */
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
// ====== 配置 ======
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const DRY_RUN = process.argv.includes("--dry-run");  // 加 --dry-run 可以只打印不删除
// 数据库连接
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// ====== 工具函数 ======
/** 递归获取目录下所有文件 */
function walkDir(dir) {
  const result = [];
  const files = fs.readdirSync(dir);

  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      result.push(...walkDir(full));
    } else {
      result.push(full);
    }
  }
  return result;
}
/** 数据库存的路径可能是 /uploads/xxx.jpg 或 uploads/xxx.jpg */
function normalizeDBPath(p) {
  if (!p) return null;
  return p.replace(/^\/+/, "").trim(); // 去掉开头斜杠
}

/** 转换成 uploads/xxx.jpg 用来对比 */
function normalizeLocalPath(fullPath) {
  return path.relative(process.cwd(), fullPath).replace(/\\/g, "/");
}

// ====== 主任务 ======
async function run() {
  console.log("\n开始清理 uploads 目录...");

  // 若 uploads 不存在则跳过
  if (!fs.existsSync(UPLOAD_DIR)) {
    console.log("未找到 uploads 目录，跳过。");
    return;
  }
  // 1. 扫描 uploads 全部文件
  console.log("扫描 uploads 目录...");
  const allLocalFiles = walkDir(UPLOAD_DIR).map(normalizeLocalPath);
  console.log(`   -> 找到 ${allLocalFiles.length} 个文件\n`);
  // 2. 查询数据库所有引用路径
  console.log("从数据库收集引用...");
  const conn = await pool.getConnection();
  const queryList = [
    ["users.avatar"],
    ["courses.cover_image"],
    ["courses.video_preview"],
    ["lessons.video_url"]
  ];
  const referenced = new Set();
  for (const [col] of queryList) {
    const [table, field] = col.split(".");
    const [rows] = await conn.query(`SELECT ${field} FROM ${table}`);
    rows.forEach(r => {
      const p = normalizeDBPath(r[field]);
      if (p && p.startsWith("uploads/")) {
        referenced.add(p);
      }
    });
  }
  conn.release();
  console.log(`   -> 数据库引用文件：${referenced.size} 个\n`);

  // 3. 找到未使用的文件
  const unused = allLocalFiles.filter(local => {
    return !referenced.has(local);
  });

  console.log(`   未被引用的文件：${unused.length} 个`);

  if (unused.length === 0) {
    console.log("  没有垃圾文件，清理结束。");
    return;
  }

  // 4. 删除或 dry-run
  for (const f of unused) {
    if (DRY_RUN) {
      console.log("   [dry-run] 会删除:", f);
    } else {
      try {
        fs.unlinkSync(path.join(process.cwd(), f));
        console.log("   删除:", f);
      } catch (err) {
        console.error("!!!  删除失败:", f, err.message);
      }
    }
  }

  console.log("\n 清理完成！");
  if (DRY_RUN) console.log("（本次 dry-run 未删除任何文件）");
}

run().catch(err => {
  console.error("X 清理出错：", err);
  process.exit(1);
});
