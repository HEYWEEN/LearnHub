<template>
  <div class="home">
    <h1>欢迎来到 LearnHub 🎓</h1>
    <el-button type="primary" @click="goLogin">立即登录</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 60px;
}
</style>
