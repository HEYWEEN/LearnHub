目录
1. 概览
2. 通用约定
3. Auth（鉴权）API
4. Users 用户 API
5. Courses 课程 API
6. Lessons 课时（与课程相关）API
7. Enroll 报名 API
8. Learning 学习进度 API
9. Notes 笔记 API
10. AI 会话 API

1. 概览
- 基础路径：/api（视项目路由挂载而定；若路由直接挂在根，请去掉 /api 前缀）
- 数据格式：请求/响应均为 JSON
- 鉴权：受保护接口使用请求头 Authorization: Bearer {token}
- 成功响应格式（sendSuccess）：{ success: true, message: string, data: any }
- 错误响应格式（sendError）：{ success: false, message: string, code?: number, errors?: any }

2. 通用约定
- 时间字段以 ISO 字符串或数据库时间戳返回
- id 使用 UUID 字符串
- 分页参数：page（默认1）、limit（默认20或接口指定）
- 状态码：常用 200 OK、201 Created、400 Bad Request、401 Unauthorized、403 Forbidden、404 Not Found、500 Internal Server Error

3. Auth（鉴权）API
- POST /api/auth/register
  - 说明：用户注册
  - 验证：无
  - Body:
    ```
    {
      "email": "user@example.com",
      "password": "string",
      "username": "display name"  // 可选
    }
    ```
  - 成功：201 或 200
    ```
    {
      "success": true,
      "message": "注册成功",
      "data": { "user": { id, username, email, role, ... }, "token": "jwt" }
    }
    ```
  - 错误：400 邮箱已存在 / 422 验证失败

- POST /api/auth/login
  - 说明：登录并返回 token
  - Body:
    ```
    { "email": "user@example.com", "password": "string" }
    ```
  - 成功：200
    ```
    { "success": true, "message": "登录成功", "data": { "user": {...}, "token": "jwt" } }
    ```
  - 错误：401 凭证错误

- GET /api/auth/me
  - 说明：获取当前登录用户信息
  - 鉴权：必须
  - 成功：200 -> userdata

- POST /api/auth/refresh
  - 说明：刷新 token（若实现 refreshToken 机制）
  - Body: { "refreshToken": "..." }
  - 成功：200 返回新 token；错误：401/400

4. Users 用户 API
- GET /api/users/:userId
  - 说明：获取指定用户档案
  - 鉴权：可选（视策略）
  - 成功：200 返回用户信息（不包含密码）

- PUT /api/users/me
  - 说明：更新当前用户资料
  - 鉴权：必须
  - Body 示例：
    ```
    { "username": "new", "bio": "...", "avatar": "/path.jpg" }
    ```
  - 成功：200 返回更新后的用户

- GET /api/users
  - 说明：用户列表（管理员可用）
  - Query: page, limit, role
  - 鉴权：可选/管理员
  - 成功：200 { users: [...], pagination: {...} }

- POST /api/users/:userId/role
  - 说明：改变用户角色（admin 操作）
  - 鉴权：admin
  - Body: { "role": "student|teacher|admin" }
  - 成功：200 返回被修改用户

5. Courses 课程 API
- GET /api/courses
  - 说明：分页列出课程
  - Query: page=1, limit=12, category, search
  - 成功：200 { courses: [...], pagination: {...} }

- GET /api/courses/:courseId
  - 说明：获取课程详情（含 lessons、reviews）
  - 成功：200 { course: {..., lessons: [...], reviews: [...] } }

- POST /api/courses
  - 说明：添加课程（teacher 或 admin）
  - 鉴权：必须（role: teacher/admin）
  - Body 示例：
    ```
    { "title":"xxx", "description":"...", "category":"前端", "cover_image":"...", "video_preview":"..." }
    ```
  - 成功：201 返回新课程

- DELETE /api/courses/:courseId
  - 说明：删除课程（作者或 admin）
  - 鉴权：必须
  - 成功：200 返回删除确认

- POST /api/courses/:courseId
  - 说明：修改课程（作者或 admin）
  - 鉴权：必须
  - Body: 可包含 title/description/category/cover_image/video_preview
  - 成功：200 返回更新后的课程

- POST /api/courses/:courseId/lesson
  - 说明：为课程添加课时（teacher）
  - 鉴权：必须（课程所属 teacher 或 admin）
  - Body:
    ```
    { "title":"章节名", "description":"", "video_url":"", "duration": 120, "is_free": true }
    ```
  - 成功：201 返回 lesson

- DELETE /api/courses/:courseId/lesson/:lessonId
  - 说明：删除课时（teacher）
  - 鉴权：必须
  - 成功：200

- POST /api/courses/:courseId/lesson/:lessonId
  - 说明：修改课时（teacher）
  - 鉴权：必须
  - Body: 同添加课时的字段
  - 成功：200 返回更新后的课时或课程课时列表

- POST /api/courses/:courseId/lesson/submit
  - 说明：原项目中可能用于提交课时或作业；检查 controller 实现以确认行为
  - 鉴权：必须（根据实现）

- POST /api/courses/:courseId/submit 或 /courses/:courseId/review
  - 说明：发布评论/评价
  - 鉴权：必须
  - Body:
    ```
    { "content":"评论文本", "rating": 4, "parentId": null }
    ```
  - 成功：201 返回评论

6. Lessons 课时 API（若有独立路由）
- 若单独存在，可支持：
  - GET /api/lessons/:lessonId 获取课时信息（可能含 video_url）
  - 其他操作参见课程相关课时接口

7. Enroll 报名 API
- POST /api/courses/:courseId/enroll
  - 说明：学生报名课程
  - 鉴权：必须（student 或任意登录用户）
  - 成功：200/201 返回 enrollment 记录或提示已报名

- POST /api/courses/:courseId/cancel
  - 说明：退课
  - 鉴权：必须
  - 成功：200 返回确认；错误：400 未报名时

8. Learning 学习进度 API
- GET /api/learning/:courseId/progress 或 GET /api/learning/progress?courseId=
  - 说明：获取当前用户在课程的学习进度
  - 鉴权：必须
  - 成功：200 返回 progress 列表或汇总

- POST /api/learning/:courseId/lesson/:lessonId/complete
  - 说明：标记章节为已完成
  - 鉴权：必须
  - 成功：200 返回标记结果 { userId, courseId, lessonId, completed: true }

- GET /api/learning/:courseId
  - 说明：获取课程学习统计（总章节/已完成/完成率）
  - 鉴权：必须
  - 成功：200 返回 { total, completed, rate, lessons, progress }

9. Notes 笔记 API
- POST /api/notes
  - 说明：创建笔记
  - 鉴权：必须
  - Body:
    ```
    { "courseId":"...", "lessonId":"...", "content":"..." }
    ```
  - 成功：201 返回笔记对象

- GET /api/notes
  - 说明：列出当前用户笔记
  - Query: courseId, lessonId, page, limit
  - 鉴权：必须
  - 成功：200 { notes: [...], pagination: {...} }

- PUT /api/notes/:noteId
  - 说明：更新笔记
  - 鉴权：必须（仅所有者或 admin）
  - Body: { content: "..." }
  - 成功：200 返回更新后的笔记

- DELETE /api/notes/:noteId
  - 说明：删除笔记
  - 鉴权：必须（仅所有者或 admin）
  - 成功：200

10. AI 会话 API
- POST /api/ai/conversations
  - 说明：创建会话
  - 鉴权：必须
  - Body: { "title": "...", "courseId": "..." }
  - 成功：201 返回 conversation

- GET /api/ai/conversations
  - 说明：列出当前用户会话
  - Query: page, limit
  - 鉴权：必须
  - 成功：200 { conversations: [...], pagination: {...} }

- GET /api/ai/conversations/:conversationId
  - 说明：获取会话详情
  - 鉴权：必须或基于权限
  - 成功：200 返回会话信息

- POST /api/ai/conversations/:conversationId/messages
  - 说明：发送消息到会话（并可能触发 AI 回复）
  - 鉴权：必须
  - Body: { "text": "...", "sender": "user|ai" }
  - 成功：200 返回 message

示例错误响应（统一）
```
{
  "success": false,
  "message": "错误描述",
  "code": 400
}
```

示例成功响应
```
{
  "success": true,
  "message": "操作成功",
  "data": { /* 具体数据 */ }
}
```

