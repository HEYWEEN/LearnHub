
** 1.2 路由 **

新增路由

- POST learning/progress/:lessonId/time

BODY: {"progress":(秒)}

保存视频进度

鉴权：有

- get learning/:lessonId/time

获取视频进度

鉴权：有

- get teacher/enrollments

列出报名自己课程（如果不填courseId就是所有课程）的学生

query : courseId

请求头：Authorization: Bearer {jwt_token} 

鉴权：有 并要求role 为老师

```
{
    "success": true,
    "message": "查询成功",
    "data": {
        "enrollments": [
            {
                "enrollment_id": "66fb939b-0472-4de4-866c-43341899f59e",
                "enrolled_at": "2025-11-23T14:18:57.000Z",
                "course_id": "1436d84d-56f5-43b9-8ea3-a32c36db8cdb",
                "course_title": "HTML5 前端基础 140",
                "student_id": "e7edfa11-cb2c-4f6c-84d0-12ddd85423da",
                "username": "student194",
                "email": "student194@example.com",
                "avatar": "/avatars/default.jpg",
                "student_created_at": "2025-11-23T14:18:38.000Z"
            },
            {
                "enrollment_id": "8013b066-28aa-4e37-9cef-acf6eaa2e70a",
                "enrolled_at": "2025-11-23T14:18:51.000Z",
                "course_id": "1436d84d-56f5-43b9-8ea3-a32c36db8cdb",
                "course_title": "HTML5 前端基础 140",
                "student_id": "28d973a9-4b7e-4727-90e1-f9d8005c9813",
                "username": "student5",
                "email": "student5@example.com",
                "avatar": "/avatars/default.jpg",
                "student_created_at": "2025-11-23T14:18:30.000Z"
            },
            {
                "enrollment_id": "840dc518-14c2-4e2d-b613-798ec503a6c9",
                "enrolled_at": "2025-11-23T14:18:58.000Z",
                "course_id": "1436d84d-56f5-43b9-8ea3-a32c36db8cdb",
                "course_title": "HTML5 前端基础 140",
                "student_id": "dff6bf61-c7a1-4454-8328-34bf35cf8be6",
                "username": "student241",
                "email": "student241@example.com",
                "avatar": "/avatars/default.jpg",
                "student_created_at": "2025-11-23T14:18:40.000Z"
            }
        ]
    },
    "code": 200
}
```


- get /enrollments/:courseId/:studentId

获取指定学生课程的学习进度

鉴权：有 并要求role 为老师或管理员
```
{
    "success": true,
    "message": "获取学生课程学习数据成功",
    "data": {
        "total": 13,
        "completed": 1,
        "rate": 8,
        "progress": [
            {
                "total_time": 229,
                "watch_time": 380,
                "title": "Lesson 6",
                "lesson_created_at": "2025-12-03T03:07:03.000Z",
                "lesson_id": "0e64089b-e430-4a6e-beb6-ad123f3f1d18",
                "completed": 1,
                "updated_at": "2025-12-03T03:07:35.000Z"
            },
            {
                "total_time": 557,
                "watch_time": 25,
                "title": "Lesson 1",
                "lesson_created_at": "2025-12-03T03:07:03.000Z",
                "lesson_id": "dd1714bb-559d-4dd3-aefe-bb3b38d154de",
                "completed": 0,
                "updated_at": "2025-12-03T03:07:35.000Z"
            }
        ]
    },
    "code": 200
}
```
- get /teacher/courses

获取老师开的所有课程列表

鉴权：有 并要求role 为老师

- get /teacher/statistics

获取老师一些统计数据，包括开设课程数量、章节数量、报名学生数量、总评论数量

鉴权：有 并要求role 为老师


** 1.1 路由 **

- GET /auth/refresh

刷新jwt token有效期，返回一个新的token

请求头:

Authorization: Bearer {token}

返回：
```
 {success:True
  message:"..."
  data:{ 
    token:...  
  }
  code:200
 }
 ```


-  GET /courses/{courseId}/enroll-status

检测报名状态（student）

请求头:

Authorization: Bearer {token}

返回：
```
 {success:True
  message:"查询成功"
  data:{ 
    isEnrolled:True  
  }
  code:200
 }
```

** 1.0 ** ：

- post api/auth/password

changePassword

鉴权：必须

返回：
```
success: true
message: 修改密码成功
data: null
code: 200
```

- delete api/auth/delete

deleteAccount

请求体: Body: { "password": ... }

鉴权：必须

返回：
```
success: true
message: 删除账号成功
data: null
code: 200
```

** ai相关api **

1. 获取消息列表 GET /api/ai/conversation/:conversationId

- Query参数:

page

limit



```
{对象}
success: true
message: 获取消息成功
data:
  {对象}
  message:
    {对象}
    messages:
      [数组，共 10 项]
      - [0] 
        {对象}
        id: 07b3cca7-e84e-4082-85f1-d6deb4bb73c3
        conversation_id: ad6ae40e-fad9-4314-84e9-f9a3847b85d6
        sender: user
        context: 你好，能看到吗
        send_at: 2025-12-01T13:45:37.000Z

      - [1] 
        {对象}
        id: 2c75b858-b698-4f60-85c0-6abd68155a04
        conversation_id: ad6ae40e-fad9-4314-84e9-f9a3847b85d6
        sender: assistant
        context: 是的，我能看到您的消息！我是DeepSeek，很高兴为您提供帮助。😊

无论您有什么问题、需要什么帮助，或者只是想聊聊天，我都很乐意与您交流。请随时告诉我您想了解什么或需要什么协助！
        send_at: 2025-12-01T13:45:37.000Z


    pagination:
      {对象}
      page: 1
      limit: 20
      total: 10
      pages: 1

code: 200
```

2. 发送消息并获取回复 POST /api/ai/conversation/:conversationId

Body: 用户消息 text

返回：
```
{对象}
success: true
message: 消息发送成功
data:
  {对象}
  message:
    {对象}
    answer:需要我继续为您做些什么吗？ 😊

code: 200
```

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



