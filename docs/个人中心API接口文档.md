# 个人中心 API 接口文档

前端个人中心页面已实现，后端需要实现以下三个接口。

## 1. 获取用户资料

**接口路径:** `GET /api/auth/profile`

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_001",
      "username": "张三",
      "email": "zhangsan@example.com",
      "role": "student",
      "bio": "这是我的个人简介",
      "avatar": null,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

## 2. 更新用户资料

**接口路径:** `PUT /api/auth/profile`

**请求头:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体:**
```json
{
  "username": "新用户名",
  "bio": "更新后的个人简介"
}
```

**字段说明:**
- `username`: 用户名（必填，2-20个字符）
- `bio`: 个人简介（可选）
- **注意**: 头像暂不支持更新

**响应示例:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_001",
      "username": "新用户名",
      "email": "zhangsan@example.com",
      "role": "student",
      "bio": "更新后的个人简介",
      "avatar": null,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**错误响应:**
```json
{
  "success": false,
  "message": "用户名不能为空"
}
```

---

## 3. 修改密码

**接口路径:** `PUT /api/auth/password`

**请求头:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体:**
```json
{
  "currentPassword": "当前密码",
  "newPassword": "新密码"
}
```

**字段说明:**
- `currentPassword`: 当前密码（必填）
- `newPassword`: 新密码（必填，至少6位，必须包含大小写字母和数字）

**密码规则:**
- 长度至少6位
- 必须包含至少一个小写字母（a-z）
- 必须包含至少一个大写字母（A-Z）
- 必须包含至少一个数字（0-9）
- 正则表达式: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$`

**响应示例:**
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

**错误响应示例:**

当前密码错误：
```json
{
  "success": false,
  "message": "当前密码不正确"
}
```

密码强度不足：
```json
{
  "success": false,
  "message": "密码必须至少6位，且包含大小写字母和数字"
}
```

---

## 前端调用方式

前端已配置好 Mock 和真实 API 的切换开关，在 `client/src/services/authService.js` 中：

```javascript
// 切换开关：true 使用 Mock，false 使用真实 API
const USE_MOCK = true
```

当后端接口开发完成后，将 `USE_MOCK` 设置为 `false` 即可切换到真实 API。

## 数据库字段建议

在用户表中需要添加 `bio` 字段用于存储个人简介：

```sql
ALTER TABLE users ADD COLUMN bio TEXT;
```

## 注意事项

1. **身份验证**: 所有接口都需要验证 JWT token
2. **邮箱不可修改**: 前端已设置邮箱为只读，后端也应禁止修改邮箱
3. **头像不可修改**: 当前版本暂不支持头像更新功能
4. **密码验证**: 修改密码时需要验证当前密码是否正确
5. **密码强度**: 必须验证新密码符合规则（至少6位，包含大小写字母和数字）
6. **数据验证**: 用户名不能为空，建议限制长度（2-20个字符）

