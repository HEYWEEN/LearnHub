<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <HeroCarousel />

    <!-- 主视觉区 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到 LearnHub</h1>
        <p class="hero-subtitle">开启您的在线学习之旅，探索无限可能</p>
        <div class="hero-buttons">
          <router-link 
            v-if="!userStore.token" 
            to="/register" 
            class="btn btn-primary"
          >
            立即注册
          </router-link>
          <router-link to="/courses" class="btn btn-secondary">
            浏览课程
          </router-link>
        </div>
      </div>
    </section>

    <!-- 推荐课程区 -->
    <section class="courses-section">
      <div class="container">
        <h2 class="section-title">热门课程推荐</h2>
        <div class="courses-placeholder">
          <div class="placeholder-icon">📚</div>
          <p class="placeholder-text">精彩课程即将上线，敬请期待...</p>
        </div>
      </div>
    </section>

    <!-- 特色功能区 -->
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>个性化学习</h3>
            <p>根据您的学习进度和兴趣，智能推荐适合的课程</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3>实时进度跟踪</h3>
            <p>清晰了解学习进度，激励自己不断前进</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>互动社区</h3>
            <p>与其他学习者交流，分享学习心得与经验</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { useUserStore } from '../../store/slices/user'
import HeroCarousel from '../../components/home/HeroCarousel.vue'
import Footer from '../../components/layout/Footer.vue'

const userStore = useUserStore()
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主视觉区 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  border-radius: 16px;
  margin-top: 20px;
  position: relative;
  z-index: 5;
  padding: 60px 24px;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  animation: fadeInDown 1s ease;
}

.hero-subtitle {
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.95;
  animation: fadeInUp 1s ease;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  animation: fadeIn 1.2s ease;
}

.btn {
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary {
  background-color: white;
  color: #667eea;
}

.btn-primary:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* 推荐课程区 */
.courses-section {
  padding: 80px 24px;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 48px;
  color: #2c3e50;
}

.courses-placeholder {
  text-align: center;
  padding: 80px 24px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.placeholder-text {
  font-size: 18px;
  color: #7f8c8d;
}

/* 特色功能区 */
.features-section {
  padding: 80px 24px;
  background-color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 32px;
}

.feature-card {
  text-align: center;
  padding: 40px 24px;
  background-color: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
}

.feature-card p {
  font-size: 15px;
  color: #7f8c8d;
  line-height: 1.6;
}

/* 动画 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }

  .section-title {
    font-size: 28px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
