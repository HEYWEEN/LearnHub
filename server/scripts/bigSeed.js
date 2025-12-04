import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SALT = 10;

// 连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 工具函数
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const hashPassword = (pwd) => bcrypt.hash(pwd, SALT);

// 随机数据
const names = [
  "Nova",
  "Echo",
  "Kai",
  "Ryu",
  "Lia",
  "Mira",
  "Vega",
  "Orin",
  "Zoe",
  "Arin",
];
const courseTitles = [
  "JavaScript 入门",
  "现代 CSS",
  "Node.js 实战",
  "HTML5 基础",
  "数据库基础",
  "算法与数据结构",
  "C++ 进阶",
  "操作系统",
  "Python 全栈",
  "Rust 基础",
];
const lorem = [
  "这门课非常实用。",
  "老师讲得很清晰。",
  "内容稍难，但值得学。",
  "结构清楚，逻辑顺畅。",
  "五星好评。",
  "希望后面更深入一点。",
];

async function run() {
  const conn = await pool.getConnection();
  try {
    console.log("\n🚀 正在开始大型数据填充...\n");

    //
    // 1) 清空所有表
    //
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    const tables = [
      "ai_messages",
      "ai_conversation",
      "notes",
      "progress",
      "reviews",
      "enrollments",
      "lessons",
      "courses",
      "users",
    ];
    for (const t of tables) await conn.query(`TRUNCATE TABLE ${t}`);
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("🧹 已清空全部表");

    //
    // 2) 创建教师
    //
    console.log("👨‍🏫 创建 50 个教师");
    const teachers = [];
    for (let i = 0; i < 50; i++) {
      const id = randomUUID();
      teachers.push(id);
      await conn.query(
        `INSERT INTO users (id, username, email, password, role, avatar)
         VALUES (?, ?, ?, ?, 'teacher', ?)`,

        [
          id,
          `teacher${i}`,
          `teacher${i}@example.com`,
          await hashPassword("123456"),
          pick(["", "/uploads/testImg01.jpg", "/uploads/testImg02.jpg", "/uploads/testImg03.jpg"]),
        ]
      );
    }

    //
    // 3) 创建学生
    //
    console.log("👨‍🎓 创建 300 个学生");
    const students = [];
    for (let i = 0; i < 300; i++) {
      const id = randomUUID();
      students.push(id);
      await conn.query(
        `INSERT INTO users (id, username, email, password, role, avatar)
         VALUES (?, ?, ?, ?, 'student', ?)`,

        [
          id,
          `student${i}`,
          `student${i}@example.com`,
          await hashPassword("123456"),
          pick(["", "/uploads/testImg01.jpg", "/uploads/testImg02.jpg", "/uploads/testImg03.jpg"]),
        ]
      );
    }

    //
    // 4) 创建课程
    //
    console.log("📚 创建 200 门课程");
    const courses = [];
    for (let i = 0; i < 200; i++) {
      const id = randomUUID();
      courses.push(id);

      await conn.query(
        `INSERT INTO courses (id, title, description, category, instructor_id, cover_image, video_preview)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,

        [
          id,
          pick(courseTitles) + " " + rand(1, 300),
          "课程描述：" + pick(lorem),
          "programming",
          pick(teachers),
          pick(["", "/uploads/testImg04.jpg", "/uploads/testImg05.jpg", "/uploads/testImg06.jpg"]),
          pick(["/uploads/testVideo01.mp4", "/uploads/testVideo02.mp4", "/uploads/testVideo03.mp4", "/uploads/testVideo04.mp4"]),
        ]
      );
    }

    //
    // 5) 创建课时
    //
    console.log("🎞️ 创建课时...");
    const allLessons = [];
    for (const c of courses) {
      const count = rand(8, 15);
      for (let i = 0; i < count; i++) {
        const lid = randomUUID();
        allLessons.push(lid);

        await conn.query(
          `INSERT INTO lessons (id, course_id, title, description, video_url, duration, is_free)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,

          [
            lid,
            c,
            `Lesson ${i + 1}`,
            "课时内容：" + pick(lorem),
            pick(["/uploads/testVideo01.mp4", "/uploads/testVideo02.mp4", "/uploads/testVideo03.mp4", "/uploads/testVideo04.mp4"]),
            rand(60, 600),
            i === 0, // 第一节免费
          ]
        );
      }
    }

    //
    // 6) 报名记录
    //
    console.log("📝 创建报名数据...");
    const enrollmentsMap = new Map(); // 用于 progress 生成
    for (const s of students) {
      const count = rand(3, 10);
      const enrollSet = new Set();

      for (let i = 0; i < count; i++) {
        const course = pick(courses);
        if (enrollSet.has(course)) continue;
        enrollSet.add(course);

        const eid = randomUUID();
        await conn.query(
          `INSERT INTO enrollments (id, user_id, course_id)
           VALUES (?, ?, ?)`,

          [eid, s, course]
        );

        // 保存用作 progress
        if (!enrollmentsMap.has(s)) enrollmentsMap.set(s, []);
        enrollmentsMap.get(s).push(course);
      }
    }

    // ... 其他部分（评论、学习进度、笔记、AI 会话等）不变 ...

    console.log("\n🎉 全表数据填充完成！");
  } catch (e) {
    console.error("❌ 出错：", e);
  } finally {
    conn.release();
  }
}

run();
