import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home/index.vue'
import Login from '../pages/Auth/Login.vue'
import Register from '../pages/Auth/Register.vue'
import TeacherDashboard from '../pages/Teacher/Dashboard.vue'
import Profile from '../pages/Profile/index.vue'
import Courses from '../pages/Courses/index.vue'
import CourseDetail from '../pages/Courses/CourseDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/home', name: 'StudentHome', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/teacher', name: 'TeacherDashboard', component: TeacherDashboard },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/courses', name: 'Courses', component: Courses },
  { path: '/courses/:id', name: 'CourseDetail', component: CourseDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
