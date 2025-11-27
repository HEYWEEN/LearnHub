<template>
  <div class="manage-courses-page">
    <div class="page-container">
      <div class="page-header">
        <h1>课程管理</h1>
        <el-button type="primary" @click="handleCreateCourse">
          <span class="button-icon">➕</span>
          创建新课程
        </el-button>
      </div>

      <div v-loading="loading" class="courses-section">
        <div v-if="courses.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <p class="empty-text">您还没有创建课程</p>
          <el-button type="primary" @click="handleCreateCourse">创建第一个课程</el-button>
        </div>

        <div v-else class="courses-grid">
          <div v-for="course in courses" :key="course.id" class="course-card">
            <div class="course-cover">
              <img :src="course.coverImage" :alt="course.title" @error="handleImageError" />
            </div>
            <div class="course-info">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.description }}</p>
              <div class="course-meta">
                <span class="meta-item">
                  <span class="meta-icon">👥</span>
                  {{ course.enrollmentCount }} 学生
                </span>
                <span class="meta-item">
                  <span class="meta-icon">📖</span>
                  {{ course.lessonCount }} 课时
                </span>
              </div>
              <div class="course-actions">
                <el-button size="small" @click="handleViewDetail(course.id)">
                  查看详情
                </el-button>
                <el-button size="small" type="primary" @click="handleEditCourse(course.id)">
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="handleDeleteCourse(course)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/slices/user'
import { getTeacherCourses, deleteCourse } from '@/services/courseService.mock'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const courses = ref([])

// 加载课程列表
const loadCourses = async () => {
  loading.value = true
  try {
    const result = await getTeacherCourses(userStore.user.id)
    if (result.success) {
      courses.value = result.courses
    }
  } catch (error) {
    console.error('加载课程列表失败:', error)
    ElMessage.error('加载课程列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCourses()
})

const handleImageError = (e) => {
  e.target.src = '/src/assets/images/default-course.png'
}

const handleCreateCourse = () => {
  router.push('/teacher/courses/create')
}

const handleViewDetail = (courseId) => {
  router.push(`/courses/${courseId}`)
}

const handleEditCourse = (courseId) => {
  router.push({
    path: '/teacher/courses/create',
    query: { courseId }
  })
}

const handleDeleteCourse = async (course) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除课程"${course.title}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    await deleteCourse(course.id)
    ElMessage.success('课程删除成功！')
    await loadCourses()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除课程失败:', error)
      ElMessage.error('删除课程失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.manage-courses-page {
  min-height: calc(100vh - 64px);
  background-color: #f5f7fa;
  padding: 40px 20px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.button-icon {
  margin-right: 4px;
}

.courses-section {
  min-height: 400px;
}

/* 空状态 */
.empty-state {
  background: white;
  border-radius: 12px;
  padding: 80px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 24px;
}

/* 课程网格 */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%; /* 让卡片填满网格单元格 */
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.course-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1; /* 让info区域占据剩余空间 */
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-description {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
  min-height: 44px; /* 固定两行文本的最小高度 (14px * 1.6 * 2) */
}

.course-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.meta-item {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  font-size: 16px;
}

.course-actions {
  display: flex;
  gap: 8px;
  margin-top: auto; /* 将按钮推到底部 */
}

.course-actions .el-button {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .course-actions {
    flex-direction: column;
  }
  
  .course-actions .el-button {
    width: 100%;
  }
}
</style>

