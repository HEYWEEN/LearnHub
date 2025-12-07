import axios from './axios'

// 登录
export const login = async (email, password, role) => {
  // authService 需要直接访问完整响应，因为需要获取 token
  const response = await axios.post('/auth/login', { email, password, role })
  return response.data
}

// 注册
export const register = async (username, email, password, role) => {
  const response = await axios.post('/auth/register', { username, email, password, role })
  return response.data
}

// 获取用户信息
export const getUserProfile = async () => {
  const response = await axios.get('/auth/me')
  return response.profile
}

// 更新用户信息
export const updateUserProfile = async (profileData) => {
  const response = await axios.put('/users/me', profileData)
  return response
}

// 修改密码
export const changePassword = async (passwordData) => {
  const response = await axios.post('/auth/password', passwordData)
  return response
}

// 上传头像
export const uploadAvatar = async (avatarFile) => {
  const formData = new FormData()
  formData.append('image', avatarFile)
  const response = await axios.put('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}