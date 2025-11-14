import { defineStore } from 'pinia'
import * as authService from '../../services/authService'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
    isStudent: (state) => state.user?.role === 'student',
    isTeacher: (state) => state.user?.role === 'teacher',
    userName: (state) => state.user?.username || '用户',
    userAvatar: (state) => state.user?.avatar || null
  },
  actions: {
    // 设置 token 和用户信息（内部方法）
    setAuth(token, user) {
      this.token = token
      this.user = user
      // 将token和user信息保存到localStorage中，持久化
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    // 清除认证信息（内部方法）
    clearAuth() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // 用户登录业务逻辑
    async loginUser(email, password, role) {
      this.loading = true
      this.error = null
      
      try {
        const data = await authService.login(email, password, role)
        this.setAuth(data.token, data.user)
        return { success: true, user: data.user }
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败，请检查账号或密码'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 用户注册业务逻辑
    async registerUser(username, email, password, role) {
      this.loading = true
      this.error = null
      
      try {
        const data = await authService.register(username, email, password, role)
        this.setAuth(data.token, data.user)
        return { success: true, user: data.user }
      } catch (error) {
        this.error = error.response?.data?.message || '注册失败，请稍后再试'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 用户退出登录
    async logoutUser() {
      this.clearAuth()
      this.error = null
    }
  }
})
