import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import dotenv from 'dotenv'

dotenv.config();

const SALT = 10;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// 工具
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[rand(0, arr.length - 1)];

async function hashPassword(pwd) {
  return bcrypt.hash(pwd, SALT);
}

// 随机生成数据
const names = ["Nova", "Echo", "Kai", "Ryu", "Lia", "Mira", "Vega", "Orin", "Zoe", "Arin"];
const courseTitles = [
  "JavaScript 入门", "现代 CSS", "Node.js API 实战", "HTML5 前端基础",
  "数据库基础", "算法与数据结构", "C++ 进阶课", "操作系统原理", "Python 全栈", "Rust 基础"
];
const lorem = [
  "这门课非常实用。",
  "老师讲得很清晰。",
  "内容稍微有点难，但值得学。",
  "结构清晰，逻辑顺畅。",
  "感觉很棒，五星好评。",
  "希望后面能更深入一点。"
];

async function run() {
  const conn = await pool.getConnection();
  try {
    console.log("\n🌈 Start Big Seeding...\n");

    // 关外键，清空表
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    const tables = ["users", "courses", "lessons", "enrollments", "reviews", "progress", "notes", "ai_conversation", "ai_messages"];
    for (const t of tables) await conn.query(`TRUNCATE TABLE ${t}`);
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("🔄 Tables cleared.");

    //
    // 生成教师 50 个
    //
    console.log("👨‍🏫 Creating teachers...");
    const teachers = [];
    for (let i = 0; i < 50; i++) {
      const id = randomUUID();
      teachers.push(id);
      await conn.query(
        `INSERT INTO users (id, username, email, password, role)
         VALUES (?, ?, ?, ?, 'teacher')`,
        [id, `teacher${i}`, `teacher${i}@example.com`, await hashPassword("123456")]
      );
    }

    //
    // 生成学生 300 个
    //
    console.log("👨‍🎓 Creating students...");
    const students = [];
    for (let i = 0; i < 300; i++) {
      const id = randomUUID();
      students.push(id);
      await conn.query(
        `INSERT INTO users (id, username, email, password, role)
         VALUES (?, ?, ?, ?, 'student')`,
        [id, `student${i}`, `student${i}@example.com`, await hashPassword("123456")]
      );
    }

    //
    // 生成课程 200 门
    //
    console.log("📚 Creating 200 courses...");
    const courses = [];
    for (let i = 0; i < 200; i++) {
      const id = randomUUID();
      courses.push(id);

      await conn.query(
        `INSERT INTO courses (id, title, description, category, instructor_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          id,
          pick(courseTitles) + " " + rand(1, 300),
          "课程描述：" + pick(lorem),
          "programming",
          pick(teachers)
        ]
      );
    }

    //
    // 生成课时（每门 8～15 课时）
    //
    console.log("🎞️ Creating lessons...");
    for (const c of courses) {
      const count = rand(8, 15);
      for (let i = 0; i < count; i++) {
        await conn.query(
          `INSERT INTO lessons (id, course_id, title, description, duration, is_free)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            randomUUID(),
            c,
            `Lesson ${i + 1}`,
            "课时内容：" + pick(lorem),
            rand(60, 600),
            i === 0
          ]
        );
      }
    }

    //
    // 生成报名记录（每个学生随机报名 3~10 门）
    //
    console.log("📝 Creating enrollments...");
    for (const s of students) {
      const count = rand(3, 10);
      const enrollSet = new Set();

      for (let i = 0; i < count; i++) {
        const course = pick(courses);
        if (enrollSet.has(course)) continue;
        enrollSet.add(course);

        await conn.query(
          `INSERT INTO enrollments (id, user_id, course_id)
           VALUES (?, ?, ?)`,
          [randomUUID(), s, course]
        );
      }
    }

    //
    // 生成评论（随机 1000～2000 条）
    //
    console.log("⭐ Creating reviews...");
    const reviewCount = rand(1000, 2000);
    for (let i = 0; i < reviewCount; i++) {
      await conn.query(
        `INSERT INTO reviews (id, course_id, user_id, comment, rating)
         VALUES (?, ?, ?, ?, ?)`,
        [
          randomUUID(),
          pick(courses),
          pick(students),
          pick(lorem),
          rand(3, 5)
        ]
      );
    }

    console.log("\n🎉 Big Seed Done!");

  } catch (e) {
    console.error("❌ Error:", e);
  } finally {
    conn.release();
  }
}

run();
