<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 用户信息区 -->
      <section class="user-info-card" :class="{ 'editing': isEditing }">
        <div class="card-header">
          <h2>个人资料</h2>
        </div>
        
        <div class="user-info-content">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <img :src="userAvatar" alt="用户头像" class="user-avatar" />
            </div>
          </div>

          <!-- 信息展示/编辑 -->
          <div class="info-section">
            <!-- 用户名 -->
            <div class="info-item">
              <label class="info-label">用户名</label>
              <div class="info-value" v-if="!isEditing">{{ userInfo.username }}</div>
              <el-input
                v-else
                v-model="editForm.username"
                placeholder="请输入用户名"
                clearable
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
                <el-tag :type="userInfo.role === 'student' ? 'primary' : 'success'" effect="plain">
                  {{ roleText }}
                </el-tag>
              </div>
            </div>

            <!-- 个人简介 -->
            <div class="info-item bio-item">
              <label class="info-label">个人简介</label>
              <div class="info-value bio-value" v-if="!isEditing">
                {{ userInfo.bio || '这个人很懒，什么都没写...' }}
              </div>
              <el-input
                v-else
                v-model="editForm.bio"
                type="textarea"
                placeholder="介绍一下你自己吧..."
                :rows="4"
                maxlength="200"
                show-word-limit
              />
            </div>

            <!-- 注册时间 -->
            <div class="info-item">
              <label class="info-label">注册时间</label>
              <div class="info-value">{{ formatDate(userInfo.createdAt) }}</div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <transition name="slide-down" mode="out-in">
          <div class="card-actions" :key="isEditing ? 'editing' : 'viewing'">
            <template v-if="!isEditing">
              <el-button type="primary" @click="startEdit" :icon="Edit">
                编辑信息
              </el-button>
            </template>
            <template v-else>
              <el-button @click="cancelEdit">取消</el-button>
              <el-button type="primary" @click="saveUserInfo" :loading="saving">
                保存
              </el-button>
            </template>
          </div>
        </transition>
      </section>

      <!-- 账号设置区 -->
      <section class="account-settings-card">
        <div class="card-header">
          <h2>账号设置</h2>
        </div>

        <!-- 修改密码 -->
        <div class="settings-section">
          <h3 class="section-title">修改密码</h3>
          
          <!-- 密码修改表单 -->
          <transition name="slide-fade">
            <div class="password-form" v-if="showPasswordForm">
              <el-form :model="passwordForm" ref="passwordFormRef" label-width="100px">
                <el-form-item label="当前密码" required>
                  <el-input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    placeholder="请输入当前密码"
                    show-password
                    clearable
                  />
                </el-form-item>
                
                <el-form-item label="新密码" required>
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="至少6位，需包含大小写字母和数字"
                    show-password
                    clearable
                    @input="validatePasswordStrength"
                  />
                  <!-- 密码强度实时反馈 -->
                  <div class="password-strength" v-if="passwordForm.newPassword">
                    <div class="strength-bar">
                      <div 
                        class="strength-fill" 
                        :class="passwordStrength.level"
                        :style="{ width: passwordStrength.percentage + '%' }"
                      ></div>
                    </div>
                    <div class="strength-tips">
                      <el-icon v-if="passwordValidation.hasLower" color="#67c23a"><SuccessFilled /></el-icon>
                      <el-icon v-else color="#909399"><CircleClose /></el-icon>
                      <span :class="{ valid: passwordValidation.hasLower }">小写字母</span>
                      
                      <el-icon v-if="passwordValidation.hasUpper" color="#67c23a"><SuccessFilled /></el-icon>
                      <el-icon v-else color="#909399"><CircleClose /></el-icon>
                      <span :class="{ valid: passwordValidation.hasUpper }">大写字母</span>
                      
                      <el-icon v-if="passwordValidation.hasNumber" color="#67c23a"><SuccessFilled /></el-icon>
                      <el-icon v-else color="#909399"><CircleClose /></el-icon>
                      <span :class="{ valid: passwordValidation.hasNumber }">数字</span>
                      
                      <el-icon v-if="passwordValidation.hasLength" color="#67c23a"><SuccessFilled /></el-icon>
                      <el-icon v-else color="#909399"><CircleClose /></el-icon>
                      <span :class="{ valid: passwordValidation.hasLength }">至少6位</span>
                    </div>
                  </div>
                </el-form-item>
                
                <el-form-item label="确认新密码" required>
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                    clearable
                  />
                  <!-- 密码匹配提示 -->
                  <div 
                    class="password-match-tip" 
                    v-if="passwordForm.confirmPassword"
                  >
                    <el-icon v-if="passwordsMatch" color="#67c23a"><SuccessFilled /></el-icon>
                    <el-icon v-else color="#f56c6c"><CircleClose /></el-icon>
                    <span :class="{ valid: passwordsMatch, invalid: !passwordsMatch }">
                      {{ passwordsMatch ? '密码一致' : '密码不一致' }}
                    </span>
                  </div>
                </el-form-item>

                <el-form-item>
                  <el-button @click="cancelPasswordChange">取消</el-button>
                  <el-button 
                    type="primary" 
                    @click="changePassword" 
                    :loading="changingPassword"
                    :disabled="!isPasswordFormValid"
                  >
                    确认修改
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </transition>

          <el-button
            v-if="!showPasswordForm"
            type="primary"
            plain
            @click="showPasswordForm = true"
            :icon="Lock"
          >
            修改密码
          </el-button>
        </div>

        <!-- 退出登录 -->
        <div class="settings-section logout-section">
          <h3 class="section-title">退出登录</h3>
          <p class="section-description">退出登录后，您将需要重新登录才能访问</p>
          <el-button type="danger" @click="handleLogout" :icon="SwitchButton">
            退出登录
          </el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/slices/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Lock, SwitchButton, SuccessFilled, CircleClose } from '@element-plus/icons-vue'
import defaultAvatar from '../../assets/images/default-avatar.png'
import * as authService from '../../services/authService'

const router = useRouter()
const userStore = useUserStore()

// 状态管理
const isEditing = ref(false)
const saving = ref(false)
const showPasswordForm = ref(false)
const changingPassword = ref(false)
const passwordFormRef = ref(null)

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

// 密码验证状态
const passwordValidation = ref({
  hasLower: false,
  hasUpper: false,
  hasNumber: false,
  hasLength: false
})

// 计算属性
const userAvatar = computed(() => {
  return userInfo.value.avatar || defaultAvatar
})

const roleText = computed(() => {
  return userInfo.value.role === 'student' ? '学生' : '教师'
})

// 密码强度计算
const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword
  if (!password) return { level: 'weak', percentage: 0 }
  
  let strength = 0
  if (passwordValidation.value.hasLower) strength += 25
  if (passwordValidation.value.hasUpper) strength += 25
  if (passwordValidation.value.hasNumber) strength += 25
  if (passwordValidation.value.hasLength) strength += 25
  
  if (strength <= 25) return { level: 'weak', percentage: strength }
  if (strength <= 50) return { level: 'medium', percentage: strength }
  if (strength <= 75) return { level: 'good', percentage: strength }
  return { level: 'strong', percentage: strength }
})

// 密码匹配检查
const passwordsMatch = computed(() => {
  return passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

// 密码表单是否有效
const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword &&
         passwordForm.value.confirmPassword &&
         passwordValidation.value.hasLower &&
         passwordValidation.value.hasUpper &&
         passwordValidation.value.hasNumber &&
         passwordValidation.value.hasLength &&
         passwordsMatch.value
})

// 实时验证密码强度
const validatePasswordStrength = () => {
  const password = passwordForm.value.newPassword
  passwordValidation.value = {
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasLength: password.length >= 6
  }
}

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
  } catch (error) {
    console.error('加载用户信息失败:', error)
    ElMessage.error('加载用户信息失败')
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
    ElMessage.warning('用户名不能为空')
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

    // 更新 store 中的用户信息（store 内部会处理 localStorage）
    await userStore.updateProfile({
      username: editForm.value.username,
      bio: editForm.value.bio
    })

    ElMessage.success('保存成功！')
    isEditing.value = false
  } catch (error) {
    const errorMessage = error.response?.data?.message || '保存失败，请稍后再试'
    ElMessage.error(errorMessage)
  } finally {
    saving.value = false
  }
}

// 修改密码
const changePassword = async () => {
  // 验证表单
  if (!passwordForm.value.currentPassword) {
    ElMessage.warning('请输入当前密码')
    return
  }
  if (!passwordForm.value.newPassword) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (!isPasswordFormValid.value) {
    ElMessage.warning('请确保密码符合要求且两次输入一致')
    return
  }

  changingPassword.value = true
  try {
    // 调用后端 API 修改密码
    await authService.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })

    ElMessage.success('密码修改成功！')
    cancelPasswordChange()
  } catch (error) {
    const errorMessage = error.response?.data?.message || '密码修改失败，请检查当前密码是否正确'
    ElMessage.error(errorMessage)
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
  passwordValidation.value = {
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasLength: false
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await userStore.logoutUser()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch (error) {
    // 用户取消操作
    if (error !== 'cancel') {
      console.error('退出登录失败:', error)
    }
  }
}

// 组件挂载时加载用户信息
onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
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
  transition: all 0.3s ease;
}

/* 编辑状态高亮 */
.user-info-card.editing {
  box-shadow: 0 4px 30px rgba(102, 126, 234, 0.3);
  border: 2px solid #667eea;
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

.bio-value {
  color: #666;
  font-style: italic;
  line-height: 1.6;
}

/* 卡片操作按钮 */
.card-actions {
  padding: 24px 32px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  margin-top: 20px;
  max-width: 500px;
}

/* 密码强度指示器 */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak {
  background-color: #f56c6c;
}

.strength-fill.medium {
  background-color: #e6a23c;
}

.strength-fill.good {
  background-color: #409eff;
}

.strength-fill.strong {
  background-color: #67c23a;
}

.strength-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #909399;
}

.strength-tips span {
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s ease;
}

.strength-tips span.valid {
  color: #67c23a;
  font-weight: 500;
}

/* 密码匹配提示 */
.password-match-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 13px;
}

.password-match-tip span.valid {
  color: #67c23a;
  font-weight: 500;
}

.password-match-tip span.invalid {
  color: #f56c6c;
  font-weight: 500;
}

/* 退出登录区域 */
.logout-section {
  background-color: #fef5f5;
}

/* 密码表单淡入动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* 按钮区域下拉动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-15px);
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

  .settings-section {
    padding: 24px 20px;
  }

  .password-form {
    max-width: 100%;
  }
}

/* Element Plus 自定义样式 */
:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
}
</style>
