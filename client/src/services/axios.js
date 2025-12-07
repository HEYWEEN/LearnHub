import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4004/api',
  timeout: 10000 // 增加到10秒
})

export const FILE_UPLOAD_URL = import.meta.env.VITE_FILE_UPLOAD_URL || 'http://localhost:4004'

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  res => {
    // 直接返回响应数据
    return res.data
  },
  err => {
    // 统一错误处理
    let errorMessage = '请求失败，请稍后重试'
    
    if (err.response) {
      // 服务器返回了错误状态码
      const { status, data } = err.response
      
      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          // 清除token并跳转到登录页
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 403:
          errorMessage = data?.message || '没有权限访问'
          break
        case 404:
          errorMessage = data?.message || '请求的资源不存在'
          break
        case 500:
          errorMessage = data?.message || '服务器内部错误'
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务不可用，请稍后重试'
          break
        case 504:
          errorMessage = '网关超时'
          break
        default:
          errorMessage = data?.message || `请求失败 (${status})`
      }
    } else if (err.request) {
      // 请求已发出，但没有收到响应
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = '请求超时，请检查网络连接'
      } else if (err.message === 'Network Error') {
        errorMessage = '网络错误，请检查网络连接'
      } else {
        errorMessage = '无法连接到服务器，请检查网络'
      }
    } else {
      // 请求配置出错
      errorMessage = err.message || '请求配置错误'
    }
    
    // 将错误信息附加到错误对象上，方便调用方使用
    err.errorMessage = errorMessage
    
    // 对于非401错误，可以选择性地显示错误提示
    
    return Promise.reject(err)
  }
)

export default instance
