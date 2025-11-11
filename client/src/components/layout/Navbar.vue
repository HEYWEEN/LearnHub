<template>
  <el-header class="navbar">
    <div class="logo">🎓 LearnHub</div>
    <div class="nav-links">
      <router-link to="/">首页</router-link>
      <router-link to="/login">登录</router-link>
    </div>
  </el-header>
</template>

<style scoped>
.navbar {
  background-color: #2d3748;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}

.nav-links a {
  color: white;
  margin-left: 20px;
  text-decoration: none;
}
</style>