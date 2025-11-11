<template>
    <div class="login-page">
      <el-card class="login-card">
        <h2>用户登录</h2>
        <el-form :model="form" @submit.prevent="handleLogin">
          <el-form-item label="邮箱">
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="form.password" />
          </el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { login } from '@/services/authService'
  import { useUserStore } from '@/store/slices/user'
  
  const form = ref({ email: '', password: '' })
  const userStore = useUserStore()
  
  async function handleLogin() {
    try {
      const res = await login(form.value.email, form.value.password)
      userStore.login(res.token, res.user)
      alert('登录成功')
    } catch {
      alert('登录失败，请检查账号或密码')
    }
  }
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    justify-content: center;
    padding: 80px 0;
  }
  .login-card {
    width: 350px;
    padding: 20px;
  }
  </style>
  