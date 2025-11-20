USE learnhub;

-- ======================================
-- Users
-- ======================================

INSERT INTO users (id, username, email, password, avatar, bio, role)
VALUES
(UUID(), 'alice', 'alice@example.com', 'pass123', '/avatars/a1.jpg', '热爱编程与教学。', 'teacher'),
(UUID(), 'bob', 'bob@example.com', 'pass123', '/avatars/b1.jpg', '喜欢学习新技术。', 'student'),
(UUID(), 'carol', 'carol@example.com', 'pass123', '/avatars/c1.jpg', '前端开发者。', 'student'),
(UUID(), 'david', 'david@example.com', 'pass123', '/avatars/d1.jpg', 'AI研究方向教师。', 'teacher');


-- ======================================
-- Courses
-- ======================================

INSERT INTO courses (id, title, description, cover_image, category, instructor_id, video_preview)
VALUES
(UUID(), 'JavaScript 基础课程', '从零开始掌握 JavaScript。', '/covers/js.jpg', 'programming',
    (SELECT id FROM users WHERE username='alice'), '/preview/js.mp4'),
(UUID(), 'Python 数据分析入门', '学会使用 Python 进行数据分析。', '/covers/python.jpg', 'data',
    (SELECT id FROM users WHERE username='david'), '/preview/python.mp4'),
(UUID(), 'HTML & CSS 初级课程', '入门前端页面开发。', '/covers/htmlcss.jpg', 'frontend',
    (SELECT id FROM users WHERE username='alice'), '/preview/htmlcss.mp4');


-- ======================================
-- Lessons
-- ======================================

INSERT INTO lessons (id, course_id, title, description, video_url, duration, is_free)
VALUES
(UUID(), (SELECT id FROM courses WHERE title='JavaScript 基础课程'), '变量与数据类型', '介绍 JS 的基本数据类型', '/videos/js1.mp4', 600, TRUE),
(UUID(), (SELECT id FROM courses WHERE title='JavaScript 基础课程'), '条件判断', '如果世界听你的…那就写个 if 语句吧', '/videos/js2.mp4', 720, FALSE),
(UUID(), (SELECT id FROM courses WHERE title='Python 数据分析入门'), 'Python 基础语法', '掌握 Python 的基本用法', '/videos/py1.mp4', 800, TRUE),
(UUID(), (SELECT id FROM courses WHERE title='HTML & CSS 初级课程'), 'HTML 标签', '基础页面结构讲解', '/videos/htmlcss1.mp4', 500, TRUE);


-- ======================================
-- Enrollments
-- ======================================

INSERT INTO enrollments (id, user_id, course_id)
VALUES
(UUID(),
    (SELECT id FROM users WHERE username='bob'),
    (SELECT id FROM courses WHERE title='JavaScript 基础课程')),
(UUID(),
    (SELECT id FROM users WHERE username='carol'),
    (SELECT id FROM courses WHERE title='Python 数据分析入门')),
(UUID(),
    (SELECT id FROM users WHERE username='bob'),
    (SELECT id FROM courses WHERE title='HTML & CSS 初级课程'));


-- ======================================
-- Progress
-- ======================================

INSERT INTO progress (id, user_id, course_id, lesson_id, completed)
VALUES
(UUID(),
    (SELECT id FROM users WHERE username='bob'),
    (SELECT id FROM courses WHERE title='JavaScript 基础课程'),
    (SELECT id FROM lessons WHERE title='变量与数据类型'),
    TRUE),
(UUID(),
    (SELECT id FROM users WHERE username='bob'),
    (SELECT id FROM courses WHERE title='HTML & CSS 初级课程'),
    (SELECT id FROM lessons WHERE title='HTML 标签'),
    FALSE),
(UUID(),
    (SELECT id FROM users WHERE username='carol'),
    (SELECT id FROM courses WHERE title='Python 数据分析入门'),
    (SELECT id FROM lessons WHERE title='Python 基础语法'),
    TRUE);


-- ======================================
-- Reviews
-- ======================================

INSERT INTO reviews (id, course_id, user_id, comment, rating)
VALUES
(UUID(),
    (SELECT id FROM courses WHERE title='JavaScript 基础课程'),
    (SELECT id FROM users WHERE username='bob'),
    '课程很棒，讲解清晰！', 5),
(UUID(),
    (SELECT id FROM courses WHERE title='Python 数据分析入门'),
    (SELECT id FROM users WHERE username='carol'),
    '内容挺实用，不过希望多一些案例。', 4);


