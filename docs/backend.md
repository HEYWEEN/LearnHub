```
server/
│
├── README
├── package.json
├── package-lock.json
├── .env                      # 环境变量（DB credentials, SECRET_KEY 等）
├── .gitignore
│
├── scripts/                  # 工具脚本
│   ├── initDatabase.sql      # 数据库建表脚本
│   ├── cleanUploads.js       # uploads文件夹清理脚本
│   └── bigSeed.js            # 数据库测试数据填充脚本
│   └── unit                  # 后端测试界面
│       ├── public          
│       |   └── index.html          
│       |          
│       └── app.js    
│     
├── src/
│   ├── index.js              # 应用入口（创建并启动 Express）
│   ├── app.js                # 挂载中间件、路由与全局错误处理
│   │
│   ├── config/               # 配置与工具
│   │   ├── db.js             # MySQL 连接池配置（导出 getPool 或 pool）
│   │   └── jwt.js            # JWT 工具：getSecretKey / generateToken
│   │   └── multer.js         # Multer 文件上传配置模块
│   │
│   ├── controllers/          # 控制器
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollController.js
│   │   ├── lessonController.js
│   │   ├── learningController.js
│   │   ├── noteController.js
│   │   └── teacherController.js
│   │   └── usersController.js
│   │
│   ├── routes/               # 路由层（定义 URL 映射）
│   │   ├── index.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── coursesRoutes.js
│   │   ├── learningRoutes.js
│   │   └── teacherRoutes.js
│   │   └── usersRoutes.js
│   │
│   ├── middleware/               # 中间件
│   │   ├── authMiddleware.js     # JWT 验证与权限认证 
│   │   ├── errorMiddleware.js    # 错误处理
│   │   ├── notFoundMiddleware.js # 处理不存在的路由
│   │   └── loggerMiddleware.js
│   │
│   ├── repository/               # 持久层（DB CRUD 操作）
│   │   ├── aiRepository.js
│   │   ├── authRepository.js
│   │   ├── coursesRepository.js
│   │   ├── enrollRepository.js
│   │   ├── learningRepository.js
│   │   ├── lessonRepository.js
│   │   ├── noteRepository.js
│   │   ├── reviewRepository.js
│   │   └── usersRepository.js
│   │   └── transactionRepository.js # 事务与统一连接管理
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
│   │   └── teacherService.js
│   │   └── fileService.js    # 文件上传处理
│   │   └── videoService.js   # 播放视频服务
│   │
│   ├── utils/                # 工具函数
│   │   ├── asyncHandler.js
│   │   ├── configChecker.js  # 环境检查
│   │   ├── passwordUtils.js  # 密码加密与比较
│   │   └── response.js
│   │   └── logUtils.js
│   │
│   └── constants/            # 常量、状态码
│       ├── httpStatus.js
│       └── logColor.js
│
└── uploads/                  # 文件上传目录


```
