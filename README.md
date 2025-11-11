# LearnHub - 智能在线学习平台

> 南京大学软件学院《互联网计算》课程大作业  
> **项目周期**：2024年12月 - 2025年1月 (2周开发周期)

LearnHub 是一个基于人工智能技术的智能在线学习平台，为用户提供个性化学习体验。平台整合了课程管理、视频学习、进度追踪、智能问答等核心功能，展示了现代Web开发的全栈技术能力。

---

## 🛠 技术架构详解

### 前端技术栈
- **React 18** + Vite - 现代化前端框架，支持并发特性
- **Ant Design 5.x** - 企业级UI设计语言和组件库
- **Redux Toolkit** + React-Redux - 状态管理解决方案
- **React Router v6** - 声明式路由管理
- **Recharts** - 基于React的数据可视化库
- **Axios** - HTTP请求库，支持拦截器
- **Socket.io-client** - 实时通信客户端
- **React Player** - 视频播放组件

### 后端技术栈
- **Node.js** + Express.js - 服务器运行环境和Web框架
- **Mongoose** - MongoDB对象建模工具
- **JWT** - JSON Web Token用户认证
- **Bcryptjs** - 密码哈希加密
- **Multer** - 文件上传中间件
- **Express-validator** - 请求数据验证
- **Helmet** - 安全头设置
- **CORS** - 跨域资源共享
- **Nodemon** - 开发环境热重载

### 数据库设计
- **MongoDB Atlas** - 云数据库服务
- 数据模型：用户、课程、课时、评论、订单、学习进度

### 第三方服务集成
- **OpenAI API** - 智能问答和推荐
- **Socket.io** - 实时通信
- **Vercel** - 前端部署平台
- **Railway** - 后端部署平台

---

## 👥 团队成员与详细分工

### 🎯 成员A：前端主力 + UI/UX负责人

#### 🔧 技术职责深度解析
**前端架构设计**
```javascript
// 项目目录结构设计
src/
├── components/          # 通用组件
│   ├── layout/         # 布局组件
│   ├── common/         # 业务通用组件
│   └── ui/             # 基础UI组件
├── pages/              # 页面组件
│   ├── Home/           # 首页
│   ├── CourseCenter/   # 课程中心
│   ├── LearningSpace/  # 学习空间
│   └── Profile/        # 个人中心
├── hooks/              # 自定义React Hooks
├── services/           # API服务封装
├── store/              # Redux状态管理
├── utils/              # 工具函数
└── assets/             # 静态资源
```

#### 📋 详细任务清单

**第一阶段：项目基础搭建 (Day 1-2)**
- [ ] **环境初始化**
  - 使用Vite创建React项目：`npm create vite@latest learnhub-frontend --template react`
  - 安装核心依赖包：Ant Design、React Router、Redux Toolkit、Axios
  - 配置开发环境：ESLint、Prettier代码规范
  - 设置路径别名：`@/*` 指向 `src/*`

- [ ] **基础架构搭建**
  - 配置Redux Store，创建基础slices
  - 设置React Router路由配置
  - 创建全局样式和Ant Design主题定制
  - 实现响应式布局断点配置

**第二阶段：组件库开发 (Day 3-5)**
- [ ] **布局组件开发**
  - **Header组件**：实现响应式导航栏、用户菜单下拉、搜索框自动完成
  - **Sidebar组件**：可折叠侧边栏，支持多级菜单
  - **Footer组件**：页脚信息展示，社交媒体链接

- [ ] **业务组件开发**
  - **CourseCard组件**：
    ```jsx
    // 功能特性：
    // - 课程封面懒加载
    // - 悬停动画效果
    // - 进度条显示（已报名用户）
    // - 评分星级展示
    // - 响应式网格布局
    ```
  - **VideoPlayer组件**：支持多种视频格式，自定义控制栏
  - **ProgressBar组件**：环形和线性进度条，支持动画
  - **CommentList组件**：嵌套评论，支持回复和点赞

**第三阶段：页面实现 (Day 6-9)**
- [ ] **首页 (HomePage)**
  - 轮播图组件：展示热门课程
  - 课程分类导航网格
  - 个性化推荐算法展示
  - 数据统计仪表板（使用Recharts）
  - 响应式断点适配

- [ ] **课程中心 (CourseCenter)**
  - 高级筛选器：分类、难度、价格区间、评分
  - 搜索功能：支持关键词高亮
  - 虚拟滚动列表：优化大量数据性能
  - 分页组件：自定义分页逻辑

- [ ] **学习空间 (LearningSpace)**
  - 视频播放区域：进度控制、播放速率、画中画
  - 课程目录树：可折叠章节结构
  - 笔记面板：富文本编辑器集成
  - 实时评论：Socket.io集成

- [ ] **个人中心 (Profile)**
  - 用户信息表单：头像上传、表单验证
  - 学习数据可视化：学习时长图表、课程完成率
  - 我的课程管理：收藏、续学、删除
  - 成就系统：徽章展示、学习里程碑

**第四阶段：优化和测试 (Day 10-12)**
- [ ] **性能优化**
  - 组件懒加载：`React.lazy()` + `Suspense`
  - 图片优化：WebP格式、懒加载、错误降级
  - 代码分割：路由级分割，vendor库分离
  - 缓存策略：API响应缓存、本地存储

- [ ] **用户体验优化**
  - 骨架屏加载效果
  - 错误边界处理
  - 空状态友好提示
  - 移动端手势支持

#### 🎨 设计规范体系
- **色彩系统**：主色#1890ff，成功色#52c41a，警告色#faad14，错误色#ff4d4f
- **字体层级**：12px/14px/16px/20px/24px/30px/38px/46px
- **间距体系**：4px/8px/12px/16px/24px/32px/48px/64px
- **响应式断点**：xs: 480px, sm: 576px, md: 768px, lg: 992px, xl: 1200px

---

### 🎯 成员B：后端主力 + 数据库架构师

#### 🔧 技术职责深度解析

**数据库架构设计**
```javascript
// 用户模型详细设计
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  profile: {
    avatar: String,
    bio: String,
    skills: [String],
    learningGoals: [String]
  },
  learningProgress: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    lastAccessedAt: Date,
    totalLearningTime: Number
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

#### 📋 详细任务清单

**第一阶段：后端基础搭建 (Day 1-3)**
- [ ] **项目初始化**
  - 创建Express项目结构
  - 配置中间件：body-parser、cors、helmet、morgan
  - 环境变量配置：开发/生产环境分离
  - 日志系统配置：访问日志、错误日志

- [ ] **数据库设计**
  - **用户模型**：认证信息、个人资料、学习进度
  - **课程模型**：课程信息、章节结构、定价策略
  - **课时模型**：视频资源、附件、时长
  - **评论模型**：课程评价、问答互动
  - **订单模型**：购买记录、支付状态

**第二阶段：API接口开发 (Day 4-8)**
- [ ] **认证模块 API**
  - `POST /api/auth/register` - 用户注册（邮箱验证）
  - `POST /api/auth/login` - 用户登录（JWT签发）
  - `GET /api/auth/me` - 获取当前用户信息
  - `POST /api/auth/refresh` - Token刷新
  - `POST /api/auth/logout` - 用户登出

- [ ] **课程管理 API**
  - `GET /api/courses` - 课程列表（分页、筛选、排序）
  - `GET /api/courses/:id` - 课程详情
  - `POST /api/courses` - 创建课程（教师权限）
  - `PUT /api/courses/:id` - 更新课程信息
  - `GET /api/courses/:id/lessons` - 获取课程课时
  - `GET /api/courses/search` - 课程搜索

- [ ] **学习进度 API**
  - `POST /api/progress/lesson/:lessonId` - 标记课时完成
  - `GET /api/progress/course/:courseId` - 获取课程进度
  - `PUT /api/progress/course/:courseId` - 更新学习进度
  - `GET /api/progress/statistics` - 学习数据统计

**第三阶段：高级功能实现 (Day 9-11)**
- [ ] **文件上传系统**
  - 配置Multer中间件
  - 图片上传：课程封面、用户头像
  - 视频上传：分片上传、进度显示
  - 文件类型验证和大小限制

- [ ] **搜索和推荐引擎**
  - 全文搜索：课程标题、描述、标签
  - 推荐算法：基于用户行为协同过滤
  - 热门课程排行榜
  - 个性化首页内容

**第四阶段：安全与部署 (Day 12-14)**
- [ ] **安全加固**
  - JWT安全配置：过期时间、刷新机制
  - 输入验证：XSS防护、SQL注入防护
  - 速率限制：API访问频率控制
  - 数据脱敏：敏感信息过滤

- [ ] **性能优化**
  - 数据库索引优化
  - API响应缓存
  - 查询性能监控
  - 连接池配置

---

### 🎯 成员C：全栈开发 + 功能集成

#### 🔧 技术职责深度解析

**状态管理架构**
```javascript
// Redux Store配置
const store = configureStore({
  reducer: {
    auth: authReducer,           // 认证状态
    user: userReducer,           // 用户信息
    courses: coursesReducer,     // 课程数据
    learning: learningReducer,   // 学习进度
    ui: uiReducer,               // UI状态
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// 课程状态切片示例
const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    list: [],
    currentCourse: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0
    }
  },
  reducers: {
    // 异步action处理
  },
});
```

#### 📋 详细任务清单

**第一阶段：前后端对接架构 (Day 1-3)**
- [ ] **API服务层设计**
  ```javascript
  // services/api.js - 统一请求封装
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 10000,
  });

  // 请求拦截器
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        // Token过期处理
        handleTokenExpired();
      }
      return Promise.reject(error);
    }
  );
  ```

- [ ] **状态管理配置**
  - 配置Redux Store和React-Redux Provider
  - 创建认证状态管理切片
  - 实现课程数据状态管理
  - 配置学习进度状态同步

**第二阶段：核心功能集成 (Day 4-8)**
- [ ] **用户系统集成**
  - 登录注册流程对接
  - JWT Token自动管理
  - 用户权限路由守卫
  - 全局用户状态同步

- [ ] **课程功能集成**
  - 课程列表数据流管理
  - 搜索筛选功能实现
  - 课程详情页面数据预加载
  - 报名购买流程状态管理

- [ ] **学习功能集成**
  - 视频播放器状态同步
  - 学习进度自动保存
  - 笔记功能数据持久化
  - 评论系统实时更新

**第三阶段：交互体验优化 (Day 9-11)**
- [ ] **数据同步策略**
  - 乐观更新：立即UI响应，后台同步
  - 错误重试机制：指数退避算法
  - 离线数据缓存：Service Worker
  - 实时状态同步：WebSocket集成

- [ ] **用户体验优化**
  - 加载状态统一管理
  - 表单提交防重复
  - 操作反馈Toast提示
  - 网络异常友好提示

**第四阶段：系统测试联调 (Day 12-14)**
- [ ] **集成测试**
  - 端到端功能测试
  - 数据流完整性验证
  - 边界条件测试
  - 性能压力测试

- [ ] **问题排查修复**
  - Bug收集分类系统
  - 优先级排序修复
  - 回归测试验证
  - 用户体验调优

---

### 🎯 成员D：项目经理 + 创新功能开发

#### 🔧 技术职责深度解析

**AI助手系统架构**
```javascript
// AI服务集成
class AIService {
  constructor() {
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
  }

  async generateAnswer(question, context) {
    const prompt = this.buildLearningPrompt(question, context);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个专业的在线学习助手，专门解答编程、计算机科学和技术相关问题..."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  }

  buildLearningPrompt(question, userContext) {
    return `
      用户信息：${userContext.level}水平，学习目标：${userContext.goals}
      当前课程：${userContext.currentCourse}
      问题：${question}
      
      请根据用户的学习背景提供专业、易懂的解答。
    `;
  }
}
```

#### 📋 详细任务清单

**第一阶段：项目管理体系建立 (Day 1-3)**
- [ ] **项目初始化管理**
  - 创建GitHub仓库，设置分支保护规则
  - 配置GitHub Projects看板，创建任务卡片
  - 制定详细开发里程碑和时间节点
  - 建立团队沟通机制和每日站会流程

- [ ] **文档体系构建**
  - 编写项目需求规格说明书
  - 创建API接口文档模板（OpenAPI规范）
  - 制定团队代码规范和提交约定
  - 编写部署和运维操作手册

**第二阶段：AI创新功能开发 (Day 4-8)**
- [ ] **智能问答系统**
  - 集成OpenAI GPT API
  - 设计AI对话界面组件
  - 实现对话历史记录管理
  - 创建预设问题模板库

- [ ] **个性化推荐引擎**
  - 基于用户行为的协同过滤算法
  - 课程内容相似度计算
  - 学习路径智能规划
  - 实时推荐更新机制

**第三阶段：高级功能实现 (Day 9-11)**
- [ ] **实时通信系统**
  - Socket.io服务端配置
  - 实时评论和问答功能
  - 在线用户状态管理
  - 学习进度实时同步

- [ ] **数据分析看板**
  - 管理员数据统计面板
  - 用户学习行为分析
  - 课程热度和效果评估
  - 可视化图表集成

**第四阶段：部署与展示准备 (Day 12-14)**
- [ ] **全栈部署实施**
  - 前端部署到Vercel：自动化CI/CD
  - 后端部署到Railway：环境变量配置
  - 数据库部署到MongoDB Atlas：备份策略
  - 域名配置和HTTPS证书申请

- [ ] **项目展示材料**
  - 制作项目演示PPT：架构图、功能演示
  - 录制功能演示视频：完整用户旅程
  - 编写用户使用手册：详细操作指南
  - 准备项目答辩材料：技术亮点、创新点

#### 📊 项目管理体系
- **代码仓库管理**：GitHub + 分支策略（main/develop/feature/hotfix）
- **项目管理工具**：GitHub Projects + 自动化工作流
- **文档协作平台**：Notion/Google Docs
- **沟通协调机制**：每日站会 + 周进度评审
