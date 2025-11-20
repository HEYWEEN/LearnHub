import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home/index.vue'
import Login from '../pages/Auth/Login.vue'
import Register from '../pages/Auth/Register.vue'
import TeacherDashboard from '../pages/Teacher/Dashboard.vue'
import Profile from '../pages/Profile/index.vue'
import Courses from '../pages/Courses/index.vue'
import CourseDetail from '../pages/Courses/CourseDetail.vue'
<<<<<<< HEAD
import Learning from '../pages/Learning/index.vue'
=======
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/home', name: 'StudentHome', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/teacher', name: 'TeacherDashboard', component: TeacherDashboard },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/courses', name: 'Courses', component: Courses },
<<<<<<< HEAD
  { path: '/courses/:id', name: 'CourseDetail', component: CourseDetail },
  { 
    path: '/learning/:courseId/:chapterId?', 
    name: 'Learning', 
    component: Learning,
    meta: { requiresAuth: true }
  }
=======
  { path: '/courses/:id', name: 'CourseDetail', component: CourseDetail }
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
