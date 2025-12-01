新增路由：

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



