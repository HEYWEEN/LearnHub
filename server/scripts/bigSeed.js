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
    console.log("\n正在开始大型数据填充...\n");

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
    console.log("已清空全部表");

    //
    // 2) 创建教师
    //
    console.log("创建 50 个教师");
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
    console.log("创建 300 个学生");
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
    console.log("创建 200 门课程");
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
    console.log("创建课时...");
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
    console.log("创建报名数据...");
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

    //
    // 7) 评论
    //
    console.log("创建评论 1000~2000 条...");
    const reviewCount = rand(1000, 2000);
    for (let i = 0; i < reviewCount; i++) {
      await conn.query(
        `INSERT INTO reviews (id, course_id, user_id, comment, rating)
         VALUES (?, ?, ?, ?, ?)`,

        [randomUUID(), pick(courses), pick(students), pick(lorem), rand(3, 5)]
      );
    }

    //
    // 8) 学习进度 progress
    //
    console.log("创建 progress 数据...");

    // 建立一个 courseId -> lessons[] 的映射表，加速查询
    const courseLessonMap = new Map();
    for (const lid of allLessons) {
      const [courseId] = []; // 将 courseId 从 lessons 插入结构中取出来
    }
    // 更优：我们直接查询数据库一次构建映射
    const [lessonRows] = await conn.query("SELECT id, course_id FROM lessons");

    lessonRows.forEach((lesson) => {
      if (!courseLessonMap.has(lesson.course_id)) {
        courseLessonMap.set(lesson.course_id, []);
      }
      courseLessonMap.get(lesson.course_id).push(lesson.id);
    });

    // 开始生成 progress
    for (const student of students) {
      const enrolledCourses = enrollmentsMap.get(student) || [];

      for (const courseId of enrolledCourses) {
        const lessons = courseLessonMap.get(courseId);

        if (!lessons || lessons.length === 0) continue;

        // 学生可能观看 1~30% 的课时
        const count = rand(1, Math.max(1, Math.floor(lessons.length * 0.3)));

        // 随机抽课时
        const pickedLessons = new Set();
        while (pickedLessons.size < count) {
          pickedLessons.add(pick(lessons));
        }

        for (const lessonId of pickedLessons) {
          await conn.query(
            `INSERT INTO progress (id, user_id, course_id, lesson_id, watch_time, completed)
         VALUES (?, ?, ?, ?, ?, ?)`,

            [
              randomUUID(),
              student,
              courseId,
              lessonId,
              rand(20, 400), // 随机观看进度
              Math.random() < 0.4, // 40% 概率完成
            ]
          );
        }
      }
    }

    //
    // 9) notes 笔记
    //
    console.log("创建 notes 数据...");
    const noteCount = rand(300, 600);
    for (let i = 0; i < noteCount; i++) {
      await conn.query(
        `INSERT INTO notes (id, user_id, course_id, lesson_id, content)
         VALUES (?, ?, ?, ?, ?)`,

        [
          randomUUID(),
          pick(students),
          pick(courses),
          pick(allLessons),
          "随堂笔记：" + pick(lorem),
        ]
      );
    }

    //
    // 10) AI 会话
    //
    console.log("创建 AI 会话与消息...");
    const convCount = rand(200, 400);
    const conversations = [];

    for (let i = 0; i < convCount; i++) {
      const id = randomUUID();
      conversations.push(id);

      await conn.query(
        `INSERT INTO ai_conversation (id, title, user_id, course_id, lesson_id)
         VALUES (?, ?, ?, ?, ?)`,

        [
          id,
          "AI 会话 " + rand(1, 999),
          pick(students),
          pick(courses),
          pick(allLessons),
        ]
      );
    }

    //
    // 11) AI 消息
    //
    console.log("创建 AI 消息...");
    for (const cid of conversations) {
      const messageCount = rand(1, 5);

      for (let i = 0; i < messageCount; i++) {
        await conn.query(
          `INSERT INTO ai_messages (id, conversation_id, sender, context)
           VALUES (?, ?, ?, ?)`,

          [
            randomUUID(),
            cid,
            i % 2 === 0 ? "user" : "assistant",
            i % 2 === 0 ? "你好，AI！" : "你好！我已经收到你的消息。",
          ]
        );
      }
    }

    console.log("\n全表数据填充完成！");
  } catch (e) {
    console.error("出错：", e);
  } finally {
    conn.release();
  }
  process.exit(0);
}

run();
