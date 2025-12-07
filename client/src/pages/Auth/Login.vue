<template>
    <div class="login-page">
      <el-card class="login-card fade-in">
      <h2>登录 LearnHub</h2>
      <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱地址" />
          </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码（至少6位，含大小写字母和数字）"
            show-password
          />
          </el-form-item>
        
        <el-form-item label="身份" prop="role">
          <el-radio-group v-model="form.role">
            <el-radio label="student">学生</el-radio>
            <el-radio label="teacher">教师</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-button type="primary" @click="handleLogin" :loading="loading" class="login-btn">
          登录
        </el-button>
        
        <div class="form-footer">
          <span>没有账号？</span>
          <router-link to="/register" class="link">去注册</router-link>
        </div>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/store/slices/user'
import { getRedirectPathByRole } from '@/utils/authHelpers'
  
const router = useRouter()
  const userStore = useUserStore()
const formRef = ref(null)

const form = reactive({
  email: '',
  password: '',
  role: 'student'
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择身份', trigger: 'change' }
  ]
}

// 从 store 获取 loading 状态
const loading = computed(() => userStore.loading)
  
  async function handleLogin() {
  if (!formRef.value) return
  
  try {
    // 先验证表单
    await formRef.value.validate()
    
    // 调用 store 的业务逻辑
    const result = await userStore.loginUser(form.email, form.password, form.role)
    
    ElMessage.success('登录成功！')
    
    // 根据角色跳转到不同页面
    const redirectPath = getRedirectPathByRole(result.user.role)
    router.push(redirectPath)
  } catch (error) {
    // 错误信息由 store 处理，这里直接显示
    ElMessage.error(userStore.error || '登录失败，请检查账号或密码')
    }
  }
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .login-card {
  width: 100%;
  max-width: 420px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 26px;
  font-weight: 600;
}

.login-btn {
  width: 100%;
  height: 42px;
  font-size: 16px;
  margin-top: 10px;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.form-footer .link {
  color: #667eea;
  text-decoration: none;
  margin-left: 8px;
  font-weight: 500;
}

.form-footer .link:hover {
  text-decoration: underline;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-input__inner) {
  height: 40px;
}

:deep(.el-radio-group) {
  display: flex;
  gap: 20px;
}

/* 进入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
  </style>
  