<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 用户信息区 -->
      <section class="user-info-card">
        <div class="card-header">
          <h2>个人资料</h2>
        </div>
        
        <transition name="expand" mode="out-in">
          <div class="user-info-content" :key="isEditing ? 'editing' : 'viewing'">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <img :src="userAvatar" alt="用户头像" class="user-avatar" />
              <div v-if="isEditing" class="avatar-overlay">
                <span class="change-avatar-text">更换头像</span>
              </div>
            </div>
          </div>

          <!-- 信息展示/编辑 -->
          <div class="info-section">
            <!-- 用户名 -->
            <div class="info-item">
              <label class="info-label">用户名</label>
              <div class="info-value" v-show="!isEditing">{{ userInfo.username }}</div>
              <input
                v-show="isEditing"
                v-model="editForm.username"
                type="text"
                class="info-input"
                placeholder="请输入用户名"
              />
            </div>

            <!-- 邮箱 -->
            <div class="info-item">
              <label class="info-label">邮箱</label>
              <div class="info-value">{{ userInfo.email }}</div>
              <span class="info-note">邮箱不可修改</span>
            </div>

            <!-- 角色 -->
            <div class="info-item">
              <label class="info-label">身份</label>
              <div class="info-value">
                <span class="role-badge" :class="`role-${userInfo.role}`">
                  {{ roleText }}
                </span>
              </div>
            </div>

            <!-- 个人简介 -->
            <div class="info-item bio-item">
              <label class="info-label">个人简介</label>
              <div class="info-value bio-value" v-show="!isEditing">
                {{ userInfo.bio || '这个人很懒，什么都没写...' }}
              </div>
              <textarea
                v-show="isEditing"
                v-model="editForm.bio"
                class="info-textarea"
                placeholder="介绍一下你自己吧..."
                rows="4"
              ></textarea>
            </div>

            <!-- 注册时间 -->
            <div class="info-item">
              <label class="info-label">注册时间</label>
              <div class="info-value">{{ formatDate(userInfo.createdAt) }}</div>
            </div>
          </div>
          </div>
        </transition>

        <!-- 操作按钮 -->
        <div class="card-actions">
          <button
            v-if="!isEditing"
            @click="startEdit"
            class="btn btn-primary"
          >
            <span class="btn-icon">✏️</span>
            编辑信息
          </button>
          <template v-else>
            <button @click="cancelEdit" class="btn btn-secondary">
              取消
            </button>
            <button @click="saveUserInfo" class="btn btn-primary" :disabled="saving">
              <span v-if="!saving">保存</span>
              <span v-else class="btn-content">
                <span class="loading-spinner"></span>
                <span>保存中...</span>
              </span>
            </button>
          </template>
        </div>
      </section>

      <!-- 账号设置区 -->
      <section class="account-settings-card">
        <div class="card-header">
          <h2>账号设置</h2>
        </div>

        <!-- 修改密码 -->
        <div class="settings-section">
          <h3 class="section-title">修改密码</h3>
          
          <transition name="expand" mode="out-in">
            <div class="password-form" v-if="showPasswordForm" key="form">
              <div class="form-item">
                <label>当前密码</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="form-input"
                  placeholder="请输入当前密码"
                />
              </div>
              <div class="form-item">
                <label>新密码</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-input"
                  placeholder="请输入新密码（至少6位）"
                />
              </div>
              <div class="form-item">
                <label>确认新密码</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-input"
                  placeholder="请再次输入新密码"
                />
              </div>

              <div class="form-actions">
                <button @click="cancelPasswordChange" class="btn btn-secondary">
                  取消
                </button>
                <button
                  @click="changePassword"
                  class="btn btn-primary"
                  :disabled="changingPassword"
                >
                  <span v-if="!changingPassword">确认修改</span>
                  <span v-else class="btn-content">
                    <span class="loading-spinner"></span>
                    <span>修改中...</span>
                  </span>
                </button>
              </div>
            </div>

            <button
              v-else
              key="button"
              @click="showPasswordForm = true"
              class="btn btn-outline"
            >
              修改密码
            </button>
          </transition>
        </div>

        <!-- 退出登录 -->
        <div class="settings-section logout-section">
          <h3 class="section-title">退出登录</h3>
          <p class="section-description">退出登录后，您将需要重新登录才能访问</p>
          <button @click="handleLogout" class="btn btn-danger">
            <span class="btn-icon">🚪</span>
            退出登录
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/slices/user'
import defaultAvatar from '../../assets/images/default-avatar.png'
import * as authService from '../../services/authService'

const router = useRouter()
const userStore = useUserStore()

// 状态管理
const isEditing = ref(false)
const saving = ref(false)
const showPasswordForm = ref(false)
const changingPassword = ref(false)

// 用户信息
const userInfo = ref({
  username: '',
  email: '',
  role: '',
  bio: '',
  avatar: null,
  createdAt: ''
})

// 编辑表单
const editForm = ref({
  username: '',
  bio: ''
})

// 密码修改表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 计算属性
const userAvatar = computed(() => {
  return userInfo.value.avatar || defaultAvatar
})

const roleText = computed(() => {
  return userInfo.value.role === 'student' ? '学生' : '教师'
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    // 从 store 获取基本信息
    if (userStore.user) {
      userInfo.value = { ...userStore.user }
    }
    
    // 可选：从后端获取最新的用户信息
    // const data = await authService.getUserProfile()
    // userInfo.value = data.user
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 开始编辑
const startEdit = () => {
  editForm.value = {
    username: userInfo.value.username,
    bio: userInfo.value.bio || ''
  }
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {
    username: '',
    bio: ''
  }
}

// 保存用户信息
const saveUserInfo = async () => {
  if (!editForm.value.username.trim()) {
    alert('用户名不能为空')
    return
  }

  saving.value = true
  try {
    // 调用后端 API 更新用户信息
    await authService.updateUserProfile({
      username: editForm.value.username,
      bio: editForm.value.bio
    })

    // 更新本地状态
    userInfo.value.username = editForm.value.username
    userInfo.value.bio = editForm.value.bio

    // 更新 store 中的用户信息
    userStore.user.username = editForm.value.username
    userStore.user.bio = editForm.value.bio
    localStorage.setItem('user', JSON.stringify(userStore.user))

    alert('保存成功！')
    isEditing.value = false
  } catch (error) {
    const errorMessage = error.response?.data?.message || '保存失败，请稍后再试'
    alert(errorMessage)
  } finally {
    saving.value = false
  }
}

// 修改密码
const changePassword = async () => {
  // 验证表单
  if (!passwordForm.value.currentPassword) {
    alert('请输入当前密码')
    return
  }
  if (!passwordForm.value.newPassword) {
    alert('请输入新密码')
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    alert('新密码至少需要6位')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }

  changingPassword.value = true
  try {
    // 调用后端 API 修改密码
    await authService.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })

    alert('密码修改成功！')
    cancelPasswordChange()
  } catch (error) {
    const errorMessage = error.response?.data?.message || '密码修改失败，请检查当前密码是否正确'
    alert(errorMessage)
  } finally {
    changingPassword.value = false
  }
}

// 取消密码修改
const cancelPasswordChange = () => {
  showPasswordForm.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 退出登录
const handleLogout = async () => {
  if (!confirm('确定要退出登录吗？')) {
    return
  }

  await userStore.logoutUser()
  router.push('/login')
}

// 组件挂载时加载用户信息
onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  loadUserInfo()
})
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片通用样式 */
.user-info-card,
.account-settings-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

/* 用户信息卡片 */
.user-info-content {
  padding: 32px;
  display: flex;
  gap: 32px;
}

/* 头像区域 */
.avatar-section {
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.change-avatar-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

/* 信息区域 */
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.info-value {
  font-size: 16px;
  color: #333;
}

.info-note {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.info-input,
.info-textarea {
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.info-input:focus,
.info-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.info-textarea {
  resize: vertical;
  font-family: inherit;
}

.bio-value {
  color: #666;
  font-style: italic;
  line-height: 1.6;
}

/* 角色徽章 */
.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.role-badge.role-student {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.role-teacher {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

/* 卡片操作按钮 */
.card-actions {
  padding: 24px 32px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 按钮样式 */
.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-outline {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-icon {
  font-size: 18px;
}

/* 账号设置卡片 */
.settings-section {
  padding: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
}

/* 密码表单 */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.form-input {
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

/* 退出登录区域 */
.logout-section {
  background-color: #fef5f5;
}



/* 展开动画 - 用于整个内容区域 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Loading Spinner 动画 */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spinner 0.8s linear infinite;
}

@keyframes spinner {
  to { 
    transform: rotate(360deg); 
  }
}

.btn-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* 输入框切换时的平滑过渡 */
.info-input,
.info-textarea,
.info-value {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.info-input[style*="display: none"],
.info-textarea[style*="display: none"],
.info-value[style*="display: none"] {
  opacity: 0;
  transform: translateY(-5px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-page {
    padding: 20px 16px;
  }

  .user-info-content {
    flex-direction: column;
    align-items: center;
    padding: 24px 20px;
  }

  .avatar-wrapper {
    width: 100px;
    height: 100px;
  }

  .info-section {
    width: 100%;
  }

  .card-header {
    padding: 20px 20px;
  }

  .card-header h2 {
    font-size: 20px;
  }

  .card-actions {
    padding: 20px;
    flex-direction: column;
  }

  .card-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .settings-section {
    padding: 24px 20px;
  }

  .password-form {
    max-width: 100%;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>


