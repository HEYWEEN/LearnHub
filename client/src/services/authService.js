import axios from 'axios'
import * as mockService from './authService.mock'

// 切换开关：true 使用 Mock，false 使用真实 API
const USE_MOCK = false

const API_BASE_URL = 'http://localhost:3000/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10s超时
  headers: {
    'Content-Type': 'application/json'
  }
})

// 真实 API 调用
const realLogin = (email, password, role) =>
  axiosInstance.post('/auth/login', { email, password, role }).then(res => res.data.data)

const realRegister = (username, email, password, role) =>
  axiosInstance.post('/auth/register', { username, email, password, role }).then(res => res.data.data)

const realGetUserProfile = () =>
  axiosInstance.get('/auth/profile', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data.data)

const realUpdateUserProfile = (profileData) =>
  axiosInstance.put('/auth/profile', profileData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data.data)

const realChangePassword = (passwordData) =>
  axiosInstance.put('/auth/password', passwordData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data.data)

// 根据开关选择使用 Mock 或真实 API
export const login = USE_MOCK ? mockService.login : realLogin
export const register = USE_MOCK ? mockService.register : realRegister
export const getUserProfile = USE_MOCK ? mockService.getUserProfile : realGetUserProfile
export const updateUserProfile = USE_MOCK ? mockService.updateUserProfile : realUpdateUserProfile
export const changePassword = USE_MOCK ? mockService.changePassword : realChangePassword
