<template>
  <div class="courses-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">课程中心</h1>
        <p class="page-subtitle">探索优质课程，开启学习之旅</p>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索课程名称或关键词..."
          class="search-input"
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <span class="search-icon">🔍</span>
          </template>
        </el-input>
        <el-button
          type="primary"
          size="large"
          class="search-button"
          @click="handleSearch"
        >
          搜索
        </el-button>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="courses-container">
      <el-row :gutter="24" v-loading="loading">
        <el-col
          v-for="course in courses"
          :key="course.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <div class="course-card">
            <!-- 封面图 -->
            <div class="course-cover">
              <img :src="course.coverImage" :alt="course.title" />
              <div class="course-overlay">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleViewDetails(course.id)"
                >
                  查看详情
                </el-button>
              </div>
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
                  :src="course.instructor.avatar"
                  :alt="course.instructor.name"
                  class="instructor-avatar"
                />
                <span class="instructor-name">{{ course.instructor.name }}</span>
              </div>

              <!-- 操作按钮 -->
              <div class="course-actions">
                <el-button
                  v-if="!enrollmentStatus[course.id]"
                  type="primary"
                  class="enroll-button"
                  @click="handleEnroll(course.id)"
                >
                  立即报名
                </el-button>
                <el-button
                  v-else
                  type="danger"
                  class="cancel-button"
                  @click="handleCancelEnroll(course.id)"
                >
                  取消报名
                </el-button>
                <el-button
                  class="detail-button"
                  @click="handleViewDetails(course.id)"
                >
                  查看详情
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 空状态 -->
      <div v-if="!loading && courses.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-text">暂无课程</p>
        <p class="empty-hint">试试其他搜索关键词吧</p>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-section" v-if="pagination.total > 0">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCourses, enrollCourse, cancelEnrollment, checkEnrollmentStatus } from '../../services/courseService'
import { useUserStore } from '../../store/slices/user'

const router = useRouter()
const userStore = useUserStore()

// 数据状态
const courses = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const pagination = ref({
  page: 1,
  limit: 12,
  total: 0,
  pages: 0
})
// 存储每个课程的报名状态
const enrollmentStatus = ref({})

// 获取课程列表
const fetchCourses = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: searchKeyword.value
    }
    
    const data = await getCourses(params)
    courses.value = data.courses
    pagination.value = data.pagination
    
    // 如果用户已登录，检查每个课程的报名状态
    if (userStore.isLoggedIn) {
      await checkAllEnrollmentStatus()
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 检查所有课程的报名状态
const checkAllEnrollmentStatus = async () => {
  const statusPromises = courses.value.map(async (course) => {
    try {
      const result = await checkEnrollmentStatus(course.id)
      enrollmentStatus.value[course.id] = result.isEnrolled
    } catch (error) {
      console.error(`检查课程 ${course.id} 报名状态失败:`, error)
      enrollmentStatus.value[course.id] = false
    }
  })
  
  await Promise.all(statusPromises)
}

// 搜索处理
const handleSearch = () => {
  pagination.value.page = 1 // 重置到第一页
  fetchCourses()
}

// 分页处理
const handlePageChange = (page) => {
  pagination.value.page = page
  fetchCourses()
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 每页数量变化处理
const handleSizeChange = (size) => {
  pagination.value.limit = size
  pagination.value.page = 1
  fetchCourses()
}

// 查看详情
const handleViewDetails = (courseId) => {
  router.push(`/courses/${courseId}`)
}

// 立即报名
const handleEnroll = async (courseId) => {
  // 检查登录状态
  if (!userStore.token) {
    ElMessage.warning('请先登录后再报名课程')
    router.push('/login')
    return
  }

  try {
    const result = await enrollCourse(courseId)
    if (result.success) {
      ElMessage.success(result.message || '报名成功！')
      // 更新课程列表中的报名人数
      const course = courses.value.find(c => c.id === courseId)
      if (course) {
        course.enrollmentCount = (course.enrollmentCount || 0) + 1
      }
      // 更新报名状态
      enrollmentStatus.value[courseId] = true
    }
  } catch (error) {
    console.error('报名失败:', error)
    ElMessage.error(error.message || '报名失败，请稍后重试')
  }
}

// 取消报名
const handleCancelEnroll = async (courseId) => {
  try {
    const result = await cancelEnrollment(courseId)
    if (result.success) {
      ElMessage.success(result.message || '取消报名成功！')
      // 更新课程列表中的报名人数
      const course = courses.value.find(c => c.id === courseId)
      if (course && course.enrollmentCount > 0) {
        course.enrollmentCount = course.enrollmentCount - 1
      }
      // 更新报名状态
      enrollmentStatus.value[courseId] = false
    }
  } catch (error) {
    console.error('取消报名失败:', error)
    ElMessage.error(error.message || '取消报名失败，请稍后重试')
  }
}

// 初始化加载
onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.courses-page {
  min-height: calc(100vh - 64px);
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 24px 40px;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 48px;
  font-weight: bold;
  margin: 0 0 16px 0;
  letter-spacing: 1px;
}

.page-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

/* 搜索区域 */
.search-section {
  padding: 32px 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
}

.search-input {
  flex: 1;
}

.search-icon {
  font-size: 18px;
}

.search-button {
  width: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.search-button:hover {
  opacity: 0.9;
}

/* 课程列表容器 */
.courses-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: 400px;
}

/* 课程卡片 */
.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-bottom: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
}

/* 封面图 */
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

.course-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-card:hover .course-overlay {
  opacity: 1;
}

/* 课程信息 */
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
}

/* 课程元数据 */
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

/* 授课教师 */
.course-instructor {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
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

/* 操作按钮 */
.course-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.enroll-button {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.enroll-button:hover {
  opacity: 0.9;
}

.cancel-button {
  flex: 1;
  background: #f56c6c;
  border: none;
}

.cancel-button:hover {
  opacity: 0.9;
}

.detail-button {
  flex: 1;
  border-color: #667eea;
  color: #667eea;
}

.detail-button:hover {
  background: #f0f2ff;
  border-color: #667eea;
  color: #667eea;
}

/* 空状态 */
.empty-state {
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
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: #999;
  margin: 0;
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: center;
  padding: 40px 24px 60px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .search-container {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }

  .course-cover {
    height: 200px;
  }

  .course-actions {
    flex-direction: column;
  }
}

/* Element Plus 样式覆盖 */
:deep(.el-pagination) {
  font-weight: normal;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled):hover) {
  color: #667eea;
}
</style>

