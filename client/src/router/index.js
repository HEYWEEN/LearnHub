import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/slices/user'
import { ElMessage } from 'element-plus'

// 路由懒加载
const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: () => import('../pages/Home/index.vue')
  },
  { 
    path: '/home', 
    name: 'StudentHome', 
    component: () => import('../pages/Home/index.vue')
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('../pages/Auth/Login.vue')
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: () => import('../pages/Auth/Register.vue')
  },
  { 
    path: '/teacher', 
    name: 'TeacherDashboard', 
    component: () => import('../pages/Teacher/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'teacher' }
  },
  { 
    path: '/teacher/courses/create', 
    name: 'CreateCourse', 
    component: () => import('../pages/Teacher/CreateCourse.vue'),
    meta: { requiresAuth: true, role: 'teacher' }
  },
  { 
    path: '/teacher/courses/manage', 
    name: 'ManageCourses', 
    component: () => import('../pages/Teacher/ManageCourses.vue'),
    meta: { requiresAuth: true, role: 'teacher' }
  },
  { 
    path: '/teacher/students', 
    name: 'StudentManagement', 
    component: () => import('../pages/Teacher/StudentManagement.vue'),
    meta: { requiresAuth: true, role: 'teacher' }
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: () => import('../pages/Profile/index.vue')
  },
  { 
    path: '/courses', 
    name: 'Courses', 
    component: () => import('../pages/Courses/index.vue')
  },
  { 
    path: '/courses/:id', 
    name: 'CourseDetail', 
    component: () => import('../pages/Courses/CourseDetail.vue')
  },
  { 
    path: '/learning/:courseId/:chapterId?', 
    name: 'Learning', 
    component: () => import('../pages/Learning/index.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 1. 身份验证检查
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    next('/login')
    return
  }
  
  // 2. 角色权限检查
  if (to.meta.role) {
    if (to.meta.role === 'teacher' && !userStore.isTeacher) {
      ElMessage.error('您没有访问该页面的权限')
      next('/')
      return
    }
    if (to.meta.role === 'student' && !userStore.isStudent) {
      ElMessage.error('您没有访问该页面的权限')
      next('/teacher')
      return
    }
  }
  
  // 3. 角色路径重定向
  // 教师访问学生首页 → 自动跳转到工作台
  if (to.path === '/' && userStore.isTeacher) {
    next('/teacher')
    return
  }
  
  // 学生访问教师工作台 → 自动跳转到主页
  if (to.path.startsWith('/teacher') && userStore.isStudent) {
    next('/')
    return
  }
  
  // 4. 已登录用户访问登录/注册页 → 重定向到对应首页
  if ((to.path === '/login' || to.path === '/register') && userStore.isLoggedIn) {
    if (userStore.isTeacher) {
      next('/teacher')
    } else {
      next('/')
    }
    return
  }
  
  // 5. 正常放行
  next()
})

export default router
