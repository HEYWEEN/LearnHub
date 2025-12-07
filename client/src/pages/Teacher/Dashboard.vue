<template>
  <div class="teacher-dashboard">
    <div class="dashboard-header fade-in">
      <h1>教师工作台</h1>
      <p class="welcome-text">欢迎，{{ userName }}！</p>
    </div>

    <div class="dashboard-content">
      <!-- 快捷操作 -->
      <section class="quick-actions fade-in" style="animation-delay: 0.1s">
        <h2>快捷操作</h2>
        <div class="action-cards">
          <div class="action-card" @click="handleAddCourse" style="animation-delay: 0.2s">
            <div class="card-icon">➕</div>
            <h3>添加课程</h3>
            <p>创建新的课程内容</p>
          </div>
          <div class="action-card" @click="handleManageCourses" style="animation-delay: 0.3s">
            <div class="card-icon">📚</div>
            <h3>课程管理</h3>
            <p>管理已有的课程</p>
          </div>
          <div class="action-card" @click="handleViewStudents" style="animation-delay: 0.4s">
            <div class="card-icon">👥</div>
            <h3>学生管理</h3>
            <p>查看学生学习情况</p>
          </div>
        </div>
      </section>

      <!-- 统计信息 -->
      <section class="statistics fade-in" style="animation-delay: 0.6s">
        <h2>数据概览</h2>
        <div class="stat-cards" v-loading="loading">
          <div class="stat-card">
            <div class="stat-value">{{ statistics.totalCourses }}</div>
            <div class="stat-label">课程数量</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ statistics.totalStudents }}</div>
            <div class="stat-label">学生人数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ statistics.totalLessons }}</div>
            <div class="stat-label">课时总数</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/slices/user'
import { getTeacherStatistics } from '@/services/teacherService'

const router = useRouter()
const userStore = useUserStore()

const userName = computed(() => userStore.user?.username || '教师')

// 统计数据
const statistics = ref({
  courseCount: 0,
  studentCount: 0,
  totalLessons: 0
})

const loading = ref(false)

// 加载统计数据
const loadStatistics = async () => {
  loading.value = true
  try {
    const result = await getTeacherStatistics(userStore.user?.id)
    if (result.success) {
      statistics.value = result.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStatistics()
})

function handleAddCourse() {
  router.push('/teacher/courses/create')
}

function handleManageCourses() {
  router.push('/teacher/courses/manage')
}

function handleViewStudents() {
  router.push('/teacher/students')
}
</script>

<style scoped>
.teacher-dashboard {
  min-height: calc(100vh - 64px);
  background-color: #f5f7fa;
  padding: 40px 20px;
}

.dashboard-header {
  max-width: 1200px;
  margin: 0 auto 40px;
  text-align: center;
}

.dashboard-header h1 {
  font-size: 36px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 12px;
}

.welcome-text {
  font-size: 18px;
  color: #7f8c8d;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 快捷操作 */
.quick-actions h2,
.statistics h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 24px;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.action-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.action-card p {
  font-size: 14px;
  color: #7f8c8d;
}

/* 统计信息 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 48px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #7f8c8d;
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

.action-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 28px;
  }

  .welcome-text {
    font-size: 16px;
  }

  .action-cards,
  .stat-cards {
    grid-template-columns: 1fr;
  }
}
</style>

