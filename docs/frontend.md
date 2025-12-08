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
