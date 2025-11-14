<template>
  <header class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-container">
      <!-- Logo 区域 -->
      <div class="navbar-logo">
        <router-link to="/">
          <img src="../../assets/images/logo.jpg" alt="LearnHub" class="logo-img" />
          <span class="logo-text">LearnHub</span>
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <nav class="navbar-menu">
        <router-link to="/" class="nav-link">主页</router-link>
        <router-link to="/courses" class="nav-link">课程中心</router-link>
        <router-link to="/space" class="nav-link">学习空间</router-link>
        <router-link to="/profile" class="nav-link">个人中心</router-link>
      </nav>

      <!-- 用户状态区域 -->
      <div class="navbar-user">
        <!-- 未登录状态 -->
        <div v-if="!userStore.token" class="auth-buttons">
          <router-link to="/login" class="btn-login">登录</router-link>
          <router-link to="/register" class="btn-register">注册</router-link>
        </div>

        <!-- 已登录状态 -->
        <div v-else class="user-profile" @click="toggleDropdown" ref="profileRef">
          <img 
            :src="userAvatar" 
            alt="用户头像" 
            class="user-avatar"
          />
          <span class="user-name">{{ userName }}</span>
          <span class="dropdown-icon">▼</span>

          <!-- 下拉菜单 -->
          <div v-if="showDropdown" class="dropdown-menu">
            <router-link to="/profile" class="dropdown-item" @click="closeDropdown">
              个人中心
            </router-link>
            <div class="dropdown-divider"></div>
            <a @click="handleLogout" class="dropdown-item logout">
              退出登录
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/slices/user'
import defaultAvatar from '../../assets/images/default-avatar.png'

const router = useRouter()
const userStore = useUserStore()
const showDropdown = ref(false)
const profileRef = ref(null)
const isScrolled = ref(false)

// 用户头像
const userAvatar = computed(() => {
  return userStore.user?.avatar || defaultAvatar
})

// 用户名
const userName = computed(() => {
  return userStore.user?.username || '用户'
})

// 切换下拉菜单
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  showDropdown.value = false
}

// 处理退出登录
const handleLogout = async () => {
  await userStore.logoutUser()
  closeDropdown()
  router.push('/login')
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    closeDropdown()
  }
}

const onScroll = () => {
  isScrolled.value = window.scrollY > 80
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--color-white);
  transition: background 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1000;
}

.navbar.scrolled {
  background: var(--color-white);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  color: var(--color-gray-800);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo 区域 */
.navbar-logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 12px;
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
  letter-spacing: 0.5px;
}

/* 导航菜单 */
.navbar-menu {
  display: flex;
  gap: 32px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: inherit;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 用户状态区域 */
.navbar-user {
  position: relative;
}

/* 未登录按钮 */
.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn-login,
.btn-register {
  padding: 8px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-login {
  color: white;
  border: 1px solid white;
}

.btn-login:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-register {
  background-color: white;
  color: #667eea;
}

.btn-register:hover {
  background-color: #f0f0f0;
}

/* 已登录用户信息 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  position: relative;
}

.user-profile:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.user-name {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.dropdown-icon {
  color: white;
  font-size: 10px;
  transition: transform 0.3s ease;
}

.user-profile:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
  z-index: 1001;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.logout {
  color: #e74c3c;
}

.dropdown-item.logout:hover {
  background-color: #fee;
}

.dropdown-divider {
  height: 1px;
  background-color: #e8e8e8;
  margin: 4px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }
  
  .navbar-container {
    padding: 0 16px;
  }
  
  .logo-text {
    font-size: 18px;
  }
}
</style>