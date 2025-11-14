import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home/index.vue'
import Login from '../pages/Auth/Login.vue'
import Register from '../pages/Auth/Register.vue'
import TeacherDashboard from '../pages/Teacher/Dashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/home', name: 'StudentHome', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/teacher', name: 'TeacherDashboard', component: TeacherDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
