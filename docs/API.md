# LearnHub API

## 项目信息
- **项目名称**: LearnHub 智能在线学习平台
- **基础URL**: `http://localhost:5000/api` (开发环境)
- **数据格式**: JSON
- **认证方式**: JWT Bearer Token

## 通用规范

### 请求头
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}  # 需要认证的接口
```

### 响应格式
```json
{
  "success": true,
  "message": "操作成功描述",
  "data": {},
  "code": 200
}
```

### 错误码定义
| 状态码 | 说明           |
| ------ | -------------- |
| 200    | 成功           |
| 400    | 请求参数错误   |
| 401    | 未授权访问     |
| 403    | 权限不足       |
| 404    | 资源不存在     |
| 500    | 服务器内部错误 |

## 认证模块

### 用户注册
**POST** `/auth/register`

**请求参数:**
```json
{
  "username": "string, 必填, 3-20位字符",
  "email": "string, 必填, 有效邮箱格式",
  "password": "string, 必填, 最少6位",
  "role": "string, 选填, student/teacher, 默认student"
}
```

**成功响应:**
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "user_123",
      "username": "刘小峰",
      "email": "xiaofengliu@smail.nju.edu.cn",
      "role": "student",
      "createdAt": "2025-1-11T11:11:11Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "code": 200
}
```

**错误响应:**
```json
{
  "success": false,
  "message": "邮箱已被注册",
  "data": null,
  "code": 400
}
```

### 用户登录
**POST** `/auth/login`

**请求参数:**

```json
{
  "email": "string, 必填",
  "password": "string, 必填"
}
```

**成功响应:**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "user_123",
      "username": "刘小峰",
      "email": "xiaofengliu@smail.nju.edu.cn",
      "role": "student",
      "avatar": "/avatars/default.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "code": 200
}
```

### 获取当前用户信息
**GET** `/auth/me`

**请求头:**
```
Authorization: Bearer {token}
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "username": "刘小峰",
    "email": "xiaofengliu@smail.nju.edu.cn",
    "role": "student",
    "avatar": "/avatars/default.jpg",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "code": 200
}
```

## 用户模块

### 获取用户个人资料
**GET** `/users/profile`

**请求头:**
```
Authorization: Bearer {token}
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "username": "刘小峰",
    "email": "xiaofengliu@example.com",
    "avatar": "/avatars/avatar123.jpg",
    "bio": "热爱学习的前端开发者",
    "learningStats": {
      "totalCourses": 15,
      "completedCourses": 8,
      "totalLearningTime": 3560,
      "currentStreak": 5
    }
  },
  "code": 200
}
```

### 更新用户资料
**PUT** `/users/profile`

**请求头:**
```
Authorization: Bearer {token}
```

**请求参数:**
```json
{
  "username": "string, 选填",
  "avatar": "string, 选填, 头像URL",
  "bio": "string, 选填, 个人简介"
}
```

**成功响应:**
```json
{
  "success": true,
  "message": "资料更新成功",
  "data": {
    "user": {
      "id": "user_123",
      "username": "石头",
      "avatar": "/avatars/new_avatar.jpg",
      "bio": "更新后的个人简介"
    }
  },
  "code": 200
}
```

## 课程模块

### 获取课程列表
**GET** `/courses`

**查询参数:**
- `page`: number, 页码, 默认1
- `limit`: number, 每页数量, 默认12
- `category`: string, 分类筛选
- `difficulty`: string, 难度筛选 (beginner/intermediate/advanced)
- `search`: string, 搜索关键词
- `sort`: string, 排序方式 (newest/popular/rating)

**成功响应:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course_123",
        "title": "React从入门到实战",
        "description": "学习React核心概念和实战技巧",
        "coverImage": "/covers/react-course.jpg",
        "instructor": {
          "id": "user_456",
          "name": "王老师",
          "avatar": "/avatars/instructor456.jpg"
        },
        "price": 99.00,
        "rating": 4.8,
        "studentCount": 1250,
        "category": "前端开发",
        "difficulty": "intermediate",
        "duration": 720,
        "lessonCount": 24
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 156,
      "pages": 13
    }
  },
  "code": 200
}
```

### 获取课程详情
**GET** `/courses/{courseId}`

**成功响应:**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": "course_123",
      "title": "React从入门到实战",
      "description": "详细描述...",
      "coverImage": "/covers/react-course.jpg",
      "videoPreview": "/previews/react-preview.mp4",
      "instructor": {
        "id": "user_456",
        "name": "王老师",
        "avatar": "/avatars/instructor456.jpg",
        "bio": "资深前端工程师，8年开发经验"
      },
      "price": 99.00,
      "rating": 4.8,
      "studentCount": 1250,
      "category": "前端开发",
      "difficulty": "intermediate",
      "duration": 720,
      "lessons": [
        {
          "id": "lesson_1",
          "title": "React基础概念",
          "duration": 1800,
          "videoUrl": "/videos/lesson1.mp4",
          "isFree": true,
          "description": "学习React核心概念"
        }
      ],
      "reviews": [
        {
          "id": "review_1",
          "user": {
            "name": "学生A",
            "avatar": "/avatars/student1.jpg"
          },
          "rating": 5,
          "comment": "课程内容很棒！",
          "createdAt": "2024-01-10T14:30:00Z"
        }
      ]
    }
  },
  "code": 200
}
```

### 报名课程
**POST** `/courses/{courseId}/enroll`

**请求头:**
```
Authorization: Bearer {token}
```

**成功响应:**
```json
{
  "success": true,
  "message": "报名成功",
  "data": {
    "enrollment": {
      "id": "enroll_123",
      "userId": "user_123",
      "courseId": "course_123",
      "enrolledAt": "2024-01-15T11:20:00Z"
    }
  },
  "code": 200
}
```

## 学习模块

### 获取学习进度
**GET** `/learning/progress/{courseId}`

**请求头:**
```
Authorization: Bearer {token}
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "progress": {
      "courseId": "course_123",
      "completedLessons": ["lesson_1", "lesson_2"],
      "progress": 25,
      "totalLearningTime": 3600,
      "lastAccessedAt": "2024-01-15T10:30:00Z",
      "lastLessonId": "lesson_3"
    }
  },
  "code": 200
}
```

### 更新学习进度
**POST** `/learning/progress/{lessonId}`

**请求头:**
```
Authorization: Bearer {token}
```

**请求参数:**
```json
{
  "completed": "boolean, 是否完成该课时",
  "currentTime": "number, 当前播放位置(秒)",
  "duration": "number, 视频总时长(秒)"
}
```

**成功响应:**
```json
{
  "success": true,
  "message": "进度更新成功",
  "data": {
    "progress": {
      "lessonId": "lesson_3",
      "completed": true,
      "currentTime": 1800,
      "updatedAt": "2024-01-15T11:25:00Z"
    }
  },
  "code": 200
}
```

### 添加学习笔记
**POST** `/learning/notes`

**请求头:**
```
Authorization: Bearer {token}
```

**请求参数:**
```json
{
  "courseId": "string, 必填",
  "lessonId": "string, 必填",
  "content": "string, 必填, 笔记内容",
  "timestamp": "number, 选填, 视频时间点(秒)"
}
```

**成功响应:**
```json
{
  "success": true,
  "message": "笔记添加成功",
  "data": {
    "note": {
      "id": "note_123",
      "content": "这里是一个重要的知识点...",
      "timestamp": 125,
      "createdAt": "2024-01-15T11:30:00Z"
    }
  },
  "code": 200
}
```

## 🐳AI助手模块

### 智能问答
**POST** `/ai/ask`

**请求头:**
```
Authorization: Bearer {token}
```

**请求参数:**
```json
{
  "question": "string, 必填, 问题内容",
  "context": {
    "courseId": "string, 选填, 相关课程ID",
    "lessonId": "string, 选填, 相关课时ID"
  }
}
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "answer": "React是一个用于构建用户界面的JavaScript库...",
    "sources": ["React官方文档", "课程第三章"],
    "timestamp": "2024-01-15T11:35:00Z"
  },
  "code": 200
}
```

### 获取学习推荐
**GET** `/ai/recommendations`

**请求头:**
```
Authorization: Bearer {token}
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "courseId": "course_456",
        "title": "Vue.js实战教程",
        "coverImage": "/covers/vue-course.jpg",
        "reason": "基于你的React学习经历推荐",
        "matchScore": 0.85
      }
    ]
  },
  "code": 200
}
```

## 数据统计模块

### 获取学习统计
**GET** `/analytics/learning-stats`

**请求头:**
```
Authorization: Bearer {token}
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "totalLearningTime": 3560,
    "completedCourses": 8,
    "weeklyProgress": [
      {
        "date": "2024-01-08",
        "minutes": 45
      },
      {
        "date": "2024-01-09", 
        "minutes": 60
      }
    ],
    "categoryDistribution": [
      {
        "category": "前端开发",
        "count": 6
      },
      {
        "category": "后端开发",
        "count": 2
      }
    ]
  },
  "code": 200
}
```
