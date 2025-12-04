import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 5000
})

export const FILE_UPLOAD_URL = import.meta.env.VITE_FILE_UPLOAD_URL || 'http://localhost:3000'

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

instance.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err)
)

export default instance
