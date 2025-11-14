# 🧪 前端测试说明

## 🎭 当前状态：Mock 模式

✅ **无需后端即可测试所有功能！**

已配置 Mock Service，可以完整测试登录、注册、退出等所有认证功能。

## 🚀 立即开始

```bash
npm run dev
```

然后访问：http://localhost:5173

## 📝 测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 学生 | zhangsan@example.com | Test123 |
| 教师 | teacher@example.com | Teacher123 |

## ⚡ 快速测试

1. **学生登录** → 应跳转到 `/home`
2. **教师登录** → 应跳转到 `/teacher`  
3. **新用户注册** → 自动登录并跳转
4. **退出登录** → 清除状态，回到登录页

## 📖 详细文档

- 📚 [完整测试指南](../docs/testing-guide.md)
- 🚀 [快速开始](../docs/TESTING-QUICK-START.md)

## 🔄 切换到真实 API

编辑 `src/services/authService.js`：

```javascript
const USE_MOCK = false  // 改为 false
```

## ✅ 测试检查清单

- [ ] 学生登录成功
- [ ] 教师登录成功
- [ ] 新用户注册成功
- [ ] 密码强度验证工作正常
- [ ] 错误提示正确显示
- [ ] 退出登录功能正常
- [ ] 刷新页面后状态保持
- [ ] 导航栏状态正确

完成以上测试，认证系统即可正常使用！🎉

