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

    <!-- 热门课程推荐区 -->
    <section class="courses-section">
      <div class="container">
        <h2 class="section-title">热门课程推荐</h2>
        <div v-loading="loading" class="courses-grid">
          <div
            v-for="(course, index) in hotCourses"
            :key="course.id"
            class="course-card fade-in"
            :style="{ animationDelay: `${0.1 + index * 0.05}s` }"
            @click="handleViewDetails(course.id)"
          >
            <!-- 封面图 -->
            <div class="course-cover">
              <img
                :src="course.coverImage ? FILE_UPLOAD_URL + course.coverImage : defaultCourse"
                :alt="course.title"
              />
            </div>

            <!-- 课程信息 -->
            <div class="course-info">
              <h3 class="course-title" :title="course.title">
                {{ course.title }}
              </h3>
              <p class="course-description" :title="course.description">
                {{ course.description }}
              </p>

              <!-- 课程元数据 -->
              <div class="course-meta">
                <div class="meta-item">
                  <span class="meta-icon">👥</span>
                  <span class="meta-text">{{ course.enrollmentCount }}人报名</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">📚</span>
                  <span class="meta-text">{{ course.lessonCount }}课时</span>
                </div>
              </div>

              <!-- 授课教师 -->
              <div class="course-instructor">
                <img
                  :src="course.instructor.avatar ? FILE_UPLOAD_URL + course.instructor.avatar : defaultAvatar"
                  :alt="course.instructor.name"
                  class="instructor-avatar"
                />
                <span class="instructor-name">{{ course.instructor.name }}</span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="!loading && hotCourses.length === 0" class="empty-state">
            <div class="empty-icon">📚</div>
            <p class="empty-text">暂无热门课程</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../store/slices/user'
import HeroCarousel from '../../components/home/HeroCarousel.vue'
import Footer from '../../components/layout/Footer.vue'
import { getCourses } from '../../services/courseService'
import { FILE_UPLOAD_URL } from '../../services/axios'
import defaultAvatar from '../../assets/images/default-avatar.png'
import defaultCourse from '../../assets/images/default-course.png'

const router = useRouter()
const userStore = useUserStore()

// 数据状态
const loading = ref(false)
const hotCourses = ref([])

// 获取热门课程（按报名人数排序，取前8个）
const fetchHotCourses = async () => {
  loading.value = true
  try {
    const data = await getCourses({
      page: 1,
      limit: 6
    })
    
    // 按报名人数排序，取前8个作为热门课程
    hotCourses.value = (data.courses || []).sort((a, b) => {
      return (b.enrollmentCount || 0) - (a.enrollmentCount || 0)
    }).slice(0, 8)
  } catch (error) {
    console.error('获取热门课程失败:', error)
    ElMessage.error('获取热门课程失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 查看课程详情
const handleViewDetails = (courseId) => {
  router.push(`/courses/${courseId}`)
}

// 页面加载时获取热门课程
onMounted(() => {
  fetchHotCourses()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主视觉区 */
.hero-section {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  margin-top: 20px;
  position: relative;
  z-index: 5;
  padding: 60px 24px;
  text-align: center;
  color: #303133;
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
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background-color: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background-color: rgba(102, 126, 234, 0.1);
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

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
}

.course-cover {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .course-cover img {
  transform: scale(1.1);
}

.course-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.course-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
  height: 66px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
}

.course-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.meta-icon {
  font-size: 16px;
}

.course-instructor {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}

.instructor-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.instructor-name {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  color: #666;
  margin: 0;
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

/* 进入动画 */
.fade-in {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
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

  .courses-grid {
    grid-template-columns: 1fr;
  }

  .course-cover {
    height: 200px;
  }
}
</style>
