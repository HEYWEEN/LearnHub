| 模块                    | 文件                      | 主要函数                                   | 功能描述           |
| --------------------- | ----------------------- | -------------------------------------- | -------------- |
| **入口层**               | `src/index.js`          | `app.listen()`                         | 启动服务器，初始化数据库连接 |
| **配置层**               | `src/config/db.js`      | `sequelize.authenticate()`             | 测试数据库连接        |
|                       |                         | `sequelize.sync()`                     | 同步模型至数据库       |
| **模型层（Models）**       | 每个模型文件（如 `User.js`）     | 无函数（定义表结构）                             | 定义表字段、类型、约束、关联 |
| **控制器层（Controllers）** | `authController.js`     | `register()`                           | 用户注册           |
|                       |                         | `login()`                              | 用户登录并返回 JWT    |
|                       |                         | `getMe()`                              | 获取当前登录用户信息     |
|                       | `userController.js`     | `getProfile()`                         | 获取用户资料         |
|                       |                         | `updateProfile()`                      | 更新用户资料         |
|                       | `courseController.js`   | `getCourses()`                         | 获取课程列表         |
|                       |                         | `getCourseById()`                      | 获取课程详情         |
|                       |                         | `enrollCourse()`                       | 学生报名课程         |
|                       |                         | `addOrRemoveCourse()`                  | 教师添加/删除课程      |
|                       | `learningController.js` | `getProgress()`                        | 获取学习进度         |
|                       |                         | `updateProgress()`                     | 更新学习进度         |
|                       | `aiController.js`       | `askAI()`                              | 提问AI助手         |
|                       |                         | `getRecommendations()`                 | 获取学习推荐         |
| **中间件层（Middlewares）** | `authMiddleware.js`     | `verifyToken()`                        | 验证JWT有效性       |
|                       | `errorHandler.js`       | `errorHandler()`                       | 捕获并格式化错误响应     |
| **工具层（Utils）**        | `response.js`           | `success()` / `error()`                | 统一响应结构         |
|                       | `password.js`           | `hashPassword()` / `comparePassword()` | 密码加密与验证        |
|                       | `logger.js`             | `logRequest()`                         | 控制台请求日志输出      |
| **服务层（Services）**     | `aiService.js`          | `generateAnswer()`                     | 调用AI模型生成回答     |
|                       |                         | `generateRecommendations()`            | 智能推荐课程         |
