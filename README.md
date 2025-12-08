# LearnHub

## 项目主题

LearnHub是一个在线学习计算机相关知识的共享平台，提供课程学习、进度跟踪和智能问答等功能，其核心理念是促进学习资源公平，让每个人都能0成本学习计算机


## 项目环境

### 前端

- Vue3
- vite



### 后端

- Node.js
- MySQL
- ffmpeg
- express
- javaScript



## 项目结构

### 前端

```
client/
│
├── package.json             # 依赖与项目脚本
├── vite.config.js           # Vite 配置
├── .env.development         # 环境变量
├── index.html               # 入口 HTML
│
├── public/                  # 公共静态资源
│
└── src/                     # 核心源码目录
    │
    ├── main.js              # 入口文件，挂载 Vue 应用
    ├── App.vue              # 根组件
    │
    ├── assets/              # 资源目录
    │   └── styles/
    │   │   └── global.css   # 全局样式
    │   │
    │   └── images/
    │
    ├── components/          # 通用组件
    │   └── layout/
    │   │   └── Navbar.vue   # 导航栏组件
    │   │   └── Footer.vue
    │   │   └── AIAssitant.vue
    │   │
    │   └── learning/
    │   │   └── ChapterSiderbar.vue
    │   │   └── NotesEditor.vue
    │   │   └── VideoPlayer.vue
    │   │
    │   └── home/
    │       └── HeroCarousel.vue
    │
    │ 
    ├── pages/               # 页面模块
    │   ├── Home/
    │   │   └── index.vue    # 首页
    │   └── Auth/
    │   │   └── Login.vue    # 登录页面
    │   └── Learning/
    │   │   └── index.vue  
    │   └── Profile/
    │   │   └── index.vue
    │   └── Courses/
    │   │   └── index.vue
    │   │   └── CourseDetail.vue
    │   └── Teacher/
    │       └── CreateCourse.vue
    │       └── Dashboard.vue
    │       └── ManageCourses.vue
    │       └── StudentManagement.vue
    │
    ├── router/              # 路由配置
    │   └── index.js
    │
    ├── store/               # 状态管理（Pinia）
    │   ├── index.js
    │   └── slices/
    │       └── user.js
    │
    ├── services/            # 网络请求与API封装
    │   ├── axios.js         # Axios实例配置
    │   └── authService.js   # 登录/注册服务
    │   └── aiService.js
    │   └── learningService.js 
    │   └── courseService.js 
    │   └── teacherService.js 
    │
    └── utils/               # 工具函数（暂可为空）
```

### 后端

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



## 终端运行

前端：

`npm install`

`npm run dev`



后端：

`npm install`

`npm start`

注：如果想把预填充的数据加进去，可以运行`npm run db:test`

详情请见`./server/README.md`



## 项目介绍

视频介绍,具体可见https://box.nju.edu.cn/d/979acc9bb24340d3a035/
