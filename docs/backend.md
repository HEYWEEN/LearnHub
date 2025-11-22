```
server/
│
├── package.json
├── .env                      # 环境变量（DB credentials, SECRET_KEY 等）
├── .gitignore
├── initDatabase.sql          # 数据库建表脚本
├── src/
│   ├── index.js              # 应用入口（创建并启动 Express）
│   ├── app.js                # 挂载中间件、路由与全局错误处理
│   │
│   ├── config/               # 配置与工具
│   │   ├── db.js             # MySQL 连接池配置（导出 getPool 或 pool）
│   │   └── jwt.js            # JWT 工具：getSecretKey / generateToken
│   │
│   ├── controllers/          # 控制器（Thin controllers -> 调用 services）
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollController.js
│   │   ├── lessonController.js
│   │   ├── learningController.js
│   │   ├── noteController.js
│   │   └── usersController.js
│   │
│   ├── routes/               # 路由层（定义 URL 映射）
│   │   ├── index.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── coursesRoutes.js
│   │   ├── learningRoutes.js
│   │   └── usersRoutes.js
│   │
│   ├── middleware/           # 中间件
│   │   ├── authMiddleware.js  # JWT 验证
│   │   ├── errorMiddleware.js # 错误处理
│   │   ├── notFoundMiddleware.js # 处理不存在的路由
│   │   └── loggerMiddleware.js
│   │
│   ├── repository/           # 持久层（DB CRUD 操作）
│   │   ├── aiRepository.js
│   │   ├── authRepository.js
│   │   ├── coursesRepository.js
│   │   ├── enrollRepository.js
│   │   ├── learningRepository.js
│   │   ├── lessonRepository.js
│   │   ├── noteRepository.js
│   │   ├── reviewRepository.js
│   │   └── usersRepository.js
│   │
│   ├── services/             # 服务层（业务逻辑、组合 repository、第三方集成）
│   │   ├── aiService.js
│   │   ├── authService.js
│   │   ├── courseService.js
│   │   ├── enrollService.js
│   │   ├── lessonService.js
│   │   ├── learningService.js
│   │   ├── noteService.js
│   │   └── usersService.js
│   │
│   ├── utils/                # 工具函数
│   │   ├── asyncHandler.js
│   │   ├── configChecker.js
│   │   ├── passwordUtils.js
│   │   └── response.js
│   │
│   └── constants/            # 常量、状态码
│       ├── httpStatus.js
│       └── logColor.js
│
└── uploads/                  # 文件上传目录
└── Test/                     # 测试文件
    └── testData.sql          # 数据库测试数据

```
