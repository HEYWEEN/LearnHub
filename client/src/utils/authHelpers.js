/**
 * 根据用户角色返回登录后的跳转路径
 * @param {string} role - 用户角色 ('student' | 'teacher')
 * @returns {string} 路由路径
 */
export function getRedirectPathByRole(role) {
  switch (role) {
    case 'teacher':
      return '/teacher'
    case 'student':
    default:
      return '/'
  }
}

/**
 * 验证邮箱格式
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证密码强度
 * 要求：至少6位，包含大小写字母和数字
 * @param {string} password 
 * @returns {boolean}
 */
export function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)
}

/**
 * 获取密码强度提示文本
 * @returns {string}
 */
export function getPasswordRequirementText() {
  return '密码至少6位，需包含大小写字母和数字'
}

/**
 * 验证用户名
 * @param {string} username 
 * @returns {boolean}
 */
export function validateUsername(username) {
  return username && username.length >= 3 && username.length <= 20
}

