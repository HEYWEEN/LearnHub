/**
 * Mock 认证服务 - 用于前端测试
 * 模拟后端 API 响应，无需真实后端
 */

// 模拟数据库 - 存储已注册用户
const mockUsers = [
  {
    id: 'user_001',
    username: '张三',
    email: 'zhangsan@example.com',
    password: 'Test123', // 实际应用中密码应该加密
    role: 'student',
    avatar: null, // 使用默认头像
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'user_002',
    username: '李老师',
    email: 'teacher@example.com',
    password: 'Teacher123',
    role: 'teacher',
    avatar: null, // 使用默认头像
    createdAt: '2024-01-10T08:00:00Z'
  }
]

// 模拟网络延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 生成 Mock Token
function generateMockToken(user) {
  return `mock_token_${user.id}_${Date.now()}`
}

// 返回用户信息（不包含密码）
function sanitizeUser(user) {
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Mock 登录接口
 */
export async function login(email, password, role) {
  await delay(800) // 模拟网络延迟
  
  // 查找用户
  const user = mockUsers.find(u => 
    u.email === email && 
    u.password === password && 
    u.role === role
  )
  
  if (!user) {
    throw {
      response: {
        data: {
          message: '邮箱、密码或身份不正确'
        }
      }
    }
  }
  
  // 返回成功响应
  return {
    token: generateMockToken(user),
    user: sanitizeUser(user)
  }
}

/**
 * Mock 注册接口
 */
export async function register(username, email, password, role) {
  await delay(1000) // 模拟网络延迟
  
  // 检查邮箱是否已存在
  const existingUser = mockUsers.find(u => u.email === email)
  if (existingUser) {
    throw {
      response: {
        data: {
          message: '该邮箱已被注册'
        }
      }
    }
  }
  
  // 创建新用户
  const newUser = {
    id: `user_${Date.now()}`,
    username,
    email,
    password, // 实际应用中应该加密
    role,
    avatar: null, // 使用默认头像
    createdAt: new Date().toISOString()
  }
  
  // 添加到模拟数据库
  mockUsers.push(newUser)
  
  console.log('新用户已注册:', sanitizeUser(newUser))
  console.log('当前所有用户:', mockUsers.map(sanitizeUser))
  
  // 返回成功响应
  return {
    token: generateMockToken(newUser),
    user: sanitizeUser(newUser)
  }
}

/**
 * 获取所有 Mock 用户（用于调试）
 */
export function getMockUsers() {
  return mockUsers.map(sanitizeUser)
}

/**
 * 重置 Mock 数据（用于测试）
 */
export function resetMockUsers() {
  mockUsers.length = 0
  mockUsers.push(
    {
      id: 'user_001',
      username: '张三',
      email: 'zhangsan@example.com',
      password: 'Test123',
      role: 'student',
      avatar: null,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'user_002',
      username: '李老师',
      email: 'teacher@example.com',
      password: 'Teacher123',
      role: 'teacher',
      avatar: null,
      createdAt: '2024-01-10T08:00:00Z'
    }
  )
}

/**
 * Mock 获取用户资料接口
 */
export async function getUserProfile() {
  await delay(300)
  
  // 从 localStorage 获取当前用户
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  if (!user) {
    throw {
      response: {
        data: {
          message: '请先登录'
        }
      }
    }
  }
  
  // 从 mockUsers 中找到完整的用户信息
  const fullUser = mockUsers.find(u => u.id === user.id)
  
  if (!fullUser) {
    throw {
      response: {
        data: {
          message: '用户不存在'
        }
      }
    }
  }
  
  return {
    user: sanitizeUser(fullUser)
  }
}

/**
 * Mock 更新用户资料接口
 */
export async function updateUserProfile(profileData) {
  await delay(500)
  
  // 从 localStorage 获取当前用户
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  if (!user) {
    throw {
      response: {
        data: {
          message: '请先登录'
        }
      }
    }
  }
  
  // 找到并更新用户信息
  const userIndex = mockUsers.findIndex(u => u.id === user.id)
  
  if (userIndex === -1) {
    throw {
      response: {
        data: {
          message: '用户不存在'
        }
      }
    }
  }
  
  // 更新允许修改的字段（用户名和个人简介）
  if (profileData.username) {
    mockUsers[userIndex].username = profileData.username
  }
  if (profileData.bio !== undefined) {
    mockUsers[userIndex].bio = profileData.bio
  }
  
  console.log('用户资料已更新:', sanitizeUser(mockUsers[userIndex]))
  
  return {
    user: sanitizeUser(mockUsers[userIndex])
  }
}

/**
 * Mock 修改密码接口
 */
export async function changePassword(passwordData) {
  await delay(600)
  
  // 从 localStorage 获取当前用户
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  if (!user) {
    throw {
      response: {
        data: {
          message: '请先登录'
        }
      }
    }
  }
  
  // 找到用户
  const userIndex = mockUsers.findIndex(u => u.id === user.id)
  
  if (userIndex === -1) {
    throw {
      response: {
        data: {
          message: '用户不存在'
        }
      }
    }
  }
  
  // 验证当前密码
  if (mockUsers[userIndex].password !== passwordData.currentPassword) {
    throw {
      response: {
        data: {
          message: '当前密码不正确'
        }
      }
    }
  }
  
  // 验证新密码强度：必须包含大小写字母和数字，至少6位
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  if (!passwordPattern.test(passwordData.newPassword)) {
    throw {
      response: {
        data: {
          message: '密码必须至少6位，且包含大小写字母和数字'
        }
      }
    }
  }
  
  // 更新密码
  mockUsers[userIndex].password = passwordData.newPassword
  
  console.log('密码已修改')
  
  return {
    message: '密码修改成功'
  }
}

// 在控制台输出测试账号信息
console.log('Mock Service 已启用')
console.log('测试账号:')
console.log('学生: zhangsan@example.com / Test123')
console.log('教师: teacher@example.com / Teacher123')

