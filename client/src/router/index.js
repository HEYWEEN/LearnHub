import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home/index.vue'
import Login from '../pages/Auth/Login.vue'
import Register from '../pages/Auth/Register.vue'
import TeacherDashboard from '../pages/Teacher/Dashboard.vue'
import CreateCourse from '../pages/Teacher/CreateCourse.vue'
import ManageCourses from '../pages/Teacher/ManageCourses.vue'
import StudentManagement from '../pages/Teacher/StudentManagement.vue'
import Profile from '../pages/Profile/index.vue'
import Courses from '../pages/Courses/index.vue'
import CourseDetail from '../pages/Courses/CourseDetail.vue'
import Learning from '../pages/Learning/index.vue'
import { useUserStore } from '../store/slices/user'
import { ElMessage } from 'element-plus'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/home', name: 'StudentHome', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { 
    path: '/teacher', 
    name: 'TeacherDashboard', 
    component: TeacherDashboard,
    meta: { requiresAuth: true, role: 'teacher' }
  },
  { 
    path: '/teacher/courses/create', 
    name: 'CreateCourse', 
    component: CreateCourse,
    meta: { requiresAuth: true, role: 'teacher' }
  },
  { 
    path: '/teacher/courses/manage', 
    name: 'ManageCourses', 
    component: ManageCourses,
    meta: { requiresAuth: true, role: 'teacher' }
  },
  { 
    path: '/teacher/students', 
    name: 'StudentManagement', 
    component: StudentManagement,
    meta: { requiresAuth: true, role: 'teacher' }
  },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/courses', name: 'Courses', component: Courses },
  { path: '/courses/:id', name: 'CourseDetail', component: CourseDetail },
  { 
    path: '/learning/:courseId/:chapterId?', 
    name: 'Learning', 
    component: Learning,
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
