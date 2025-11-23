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
    "bio": "热爱学习的前端开发者"
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

所有课程相关的接口均以以下路径开头：

/courses

### 目录

获取课程列表 GET /courses

获取课程详情 GET /courses/{courseId}

报名课程 POST /courses/{courseId}/enroll

添加课程 POST /courses

删除课程 DELETE /courses/{courseId}

修改课程信息 POST /courses/{courseId}

添加课时 POST /courses/{courseId}/lesson

删除课时 DELETE /courses/{courseId}/lesson/{lessonId}

修改课时信息 POST /courses/{courseId}/lesson/{lessonId}

### 获取课程列表 GET /courses
请求参数（Query）
|参数|	类型|	默认|	描述|
|---|---|---|---|
page	|number	|1|	页码
limit	|number	|12|	每页数量
category|	string|	空（可选）|	分类筛选
search|	string|	空（可选）|	标题/描述 搜索
响应示例
```json
{
  "message": "成功获取课程列表",
  "data": {
    "courses": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 128,
      "pages": 11
    }
  }
}
```
### 获取课程详情 
GET /courses/{courseId}

响应数据

返回课程信息、课程章节、课程评论。
```json
{
  "message": "成功找到课程",
  "data": {
    "course": {
      "id": 1,
      "title": "...",
      "description": "...",
      "category": "...",
      "lessons": [...],
      "reviews": [...]
    }
  }
}
```

若找不到课程：

404 没有找到课程

### 报名课程 
POST /courses/{courseId}/enroll

需要登录（student）

响应示例
```json
{
  "message": "报名成功",
  "data": {
    "enrollment": {
      "id": 12,
      "user_id": 3,
      "course_id": 1
    }
  }
}
```

重复报名：

您已报名该课程

### 取消报名课程 

POST /courses/{courseId}/cancel

需要登录（student）

响应示例

```json
{
  "message": "退课成功，请缴纳168元退课费",
  "data": {
    "enrollment": {
      "id": 12,
      "user_id": 3,
      "course_id": 1
    }
  }
}
```

重复退课：

您未报名该课程

### 添加课程 
POST /courses

需要角色：teacher / admin

Body 参数
|字段|	类型	|必填|	描述|
|---|---|---|---|
title|	string	|是	|课程标题
description	|string|	是|	课程描述
category	|string|	是	|分类
响应示例
```json
{
  "message": "课程添加成功",
  "data": {
    "course": {
      "id": 18,
      "title": "...",
      "description": "...",
      "category": "...",
      "instructor_id": 2
    }
  }
}
```
### 删除课程 
DELETE /courses/{courseId}

需要角色：teacher / admin
教师仅能删除自己创建的课程。

响应示例
```json
{
  "message": "课程删除成功",
  "data": {
    "deletion": {
      "courseId": "12",
      "userId": 2
    }
  }
}
```
### 修改课程信息 
POST /courses/{courseId}

需要角色：teacher / admin

Body（全可选）
|字段	|类型	|描述|
|---|---|---|
title|	string|	新标题
description	|string	|新描述
category	|string|	新分类
响应示例
```json
{
  "message": "课程修改成功",
  "data": { "course": {...} }
}
```
### 添加课时 
POST /courses/{courseId}/lesson

需要角色：teacher / admin

Body
|字段|	类型|	必填	|描述|
|---|---|---|---|
title	|string	|是	|课时标题
description|	string|	是|	课时内容
isfree	|number|	否	|是否免费（0 或 1）
响应示例
```json
{
  "message": "章节添加成功",
  "data": {
    "lesson": {
      "id": 99,
      "course_id": 12,
      "title": "...",
      "description": "...",
      "is_free": 0
    }
  }
}
```
### 删除课时 
DELETE /courses/{courseId}/lesson/{lessonId}

需要角色：teacher / admin

响应示例
```json
{
  "message": "章节删除成功",
  "data": {
    "deletion": {
      "lessonId": "18",
      "userId": 2
    }
  }
}
```

### 修改课时信息 
POST /courses/{courseId}/lesson/{lessonId}

需要角色：teacher / admin

**Body**（可选）

|字段|类型|描述|
|---|---|---|
|title	|string	|新标题|
|description	|string|	新描述|
|isfree	|number|	是否免费（0 或 1）|
响应示例
```json
{
  "message": "章节修改成功",
  "data": {
    "lessons": [...]
  }
}
```

### 发表评论

POST /courses/{courseId}/submit

角色：student/teacher

**请求参数:**

```json
{
  "content": "string, 必填, 评论内容(1-1000字符)",
  "rating": "number, 必填, 评分(1-5星)",
  "parentId": "string, 选填, 父评论ID(用于回复评论)"
}
```

```json
{
  "success": true,
  "message": "评论发表成功",
  "data": {
    "comment": {
      "id": "comment_123",
      "content": "这个课程讲解得很详细，老师讲得很好！",
      "rating": 5,
      "user": {
        "id": "user_123",
        "username": "刘小峰",
        "avatar": "/avatars/user123.jpg",
        "role": "student"
      },
      "courseId": "course_456",
      "parentId": null,
      "likes": 0,
      "isEdited": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "replies": []
    }
  },
  "code": 201
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
  "completed": "boolean, 是否完成该课时"
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
      "completed": true
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
