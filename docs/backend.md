```
server/
│
├── package.json
├── .env                      # 环境变量配置（数据库账号、JWT秘钥等）
├── .gitignore
├── initDatabase.sql          # 创建数据库
├── src/
│   ├── index.js              # 入口文件（创建 Express 应用）
│   ├── app.js                # 挂载中间件、路由
│   │
│   ├── config/
│   │   ├── db.js             # 数据库连接配置（Sequelize）
│   │   └── jwt.js            # JWT 配置与工具
│   │
│   │
│   ├── controllers/          # 控制器：业务逻辑（处理请求）
│   │   ├── authController.js
│   │   ├── usersController.js
│   │   ├── courseController.js
│   │   ├── learningController.js
│   │   └── aiController.js
│   │
│   ├── routes/               # 路由层（定义URL映射）
│   │   ├── index.js          # 汇总所有子路由
│   │   ├── authRoutes.js
│   │   ├── usersRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── learningRoutes.js
│   │   └── aiRoutes.js
│   │
│   ├── middlewares/          # 中间件
│   │   ├── authMiddleware.js # JWT验证中间件
│   │   └── errorHandler.js   # 全局错误处理
│   │
│   ├── services/             # 服务层（封装第三方接口、AI模块逻辑等）
│   │   └── aiService.js
│   │
│   ├── utils/                # 工具函数（密码加密、响应封装）
│   │   ├── response.js
│   │   ├── password.js
│   │   └── logger.js
│   │
│   └── constants/            # 常量、状态码定义
│       └── httpStatus.js
│
└── tests/
    └── testData.sql
```