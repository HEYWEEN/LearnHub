<template>
  <div class="course-detail-page">
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading" :size="40">
        <Loading />
      </el-icon>
      <p>加载中...</p>
    </div>

    <div v-else-if="courseDetail" class="detail-container">
      <!-- 课程头部区域 -->
      <div class="course-header">
        <div class="header-content">
          <div class="cover-section">
            <img 
              :src="courseDetail.coverImage" 
              :alt="courseDetail.title"
              class="course-cover"
            />
          </div>
          
          <div class="info-section">
            <h1 class="course-title">{{ courseDetail.title }}</h1>
            <p class="course-description">{{ courseDetail.description }}</p>
            
            <div class="course-meta">
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span>{{ courseDetail.enrollmentCount }}人报名</span>
              </div>
              <div class="meta-item">
                <el-icon><Document /></el-icon>
                <span>{{ courseDetail.lessonCount }}课时</span>
              </div>
              <div class="meta-item">
                <el-icon><Folder /></el-icon>
                <span>{{ courseDetail.category }}</span>
              </div>
            </div>

            <div class="action-section">
              <el-button
                v-if="!isEnrolled"
                type="primary"
                size="large"
                class="enroll-button"
                :loading="enrollLoading"
                @click="handleEnroll"
              >
                立即报名
              </el-button>
              <el-button
                v-else
                type="danger"
                size="large"
                class="cancel-button"
                :loading="enrollLoading"
                @click="handleCancelEnroll"
              >
                取消报名
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <div class="content-left">
          <!-- 教师信息卡片 -->
          <el-card class="teacher-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><UserFilled /></el-icon>
                <span>授课教师</span>
              </div>
            </template>
            <div class="teacher-info">
              <img 
                :src="courseDetail.instructor.avatar" 
                :alt="courseDetail.instructor.name"
                class="teacher-avatar"
              />
              <div class="teacher-details">
                <h3 class="teacher-name">{{ courseDetail.instructor.name }}</h3>
                <p class="teacher-bio">{{ courseDetail.instructor.bio }}</p>
              </div>
            </div>
          </el-card>

          <!-- 课程章节列表 -->
          <el-card class="lessons-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><List /></el-icon>
                <span>课程章节</span>
              </div>
            </template>
            <div class="lessons-list">
              <div 
                v-for="(lesson, index) in courseDetail.lessons" 
                :key="lesson.id"
                class="lesson-item"
              >
                <div class="lesson-number">{{ index + 1 }}</div>
                <div class="lesson-info">
                  <div class="lesson-title">{{ lesson.title }}</div>
                  <div class="lesson-meta">
                    <span class="lesson-duration">
                      <el-icon><Clock /></el-icon>
                      {{ formatDuration(lesson.duration) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 评论区 -->
          <el-card class="reviews-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><ChatDotRound /></el-icon>
                <span>学员评价 ({{ courseDetail.reviews.length }})</span>
              </div>
            </template>

            <!-- 发表评论表单 -->
            <div class="review-form">
              <h4>发表评价</h4>
              <div class="rating-input">
                <span class="label">评分：</span>
                <el-rate 
                  v-model="reviewForm.rating" 
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                />
              </div>
              <el-input
                v-model="reviewForm.comment"
                type="textarea"
                :rows="4"
                placeholder="分享你的学习体验..."
                maxlength="500"
                show-word-limit
                class="comment-input"
              />
              <el-button
                type="primary"
                class="submit-button"
                :loading="reviewLoading"
                @click="handleSubmitReview"
              >
                发表评论
              </el-button>
            </div>

            <el-divider />

            <!-- 评论列表 -->
            <div class="reviews-list">
              <div 
                v-for="review in courseDetail.reviews" 
                :key="review.id"
                class="review-item"
              >
                <img 
                  :src="review.user.avatar" 
                  :alt="review.user.name"
                  class="review-avatar"
                />
                <div class="review-content">
                  <div class="review-header">
                    <span class="review-user">{{ review.user.name }}</span>
                    <el-rate 
                      v-model="review.rating" 
                      disabled 
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      size="small"
                    />
                  </div>
                  <p class="review-comment">{{ review.comment }}</p>
                  <span class="review-time">{{ formatDate(review.createdAt) }}</span>
                </div>
              </div>

              <div v-if="courseDetail.reviews.length === 0" class="empty-reviews">
                <el-empty description="暂无评价，快来发表第一条评论吧！" />
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <div v-else class="error-container">
      <el-result
        icon="warning"
        title="课程未找到"
        sub-title="抱歉，您访问的课程不存在或已被删除"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/courses')">
            返回课程列表
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Loading, User, Document, Folder, UserFilled, List, Clock, 
  ChatDotRound 
} from '@element-plus/icons-vue'
import { 
  getCourseById, 
  enrollCourse, 
  cancelEnrollment, 
  checkEnrollmentStatus,
  submitReview 
} from '../../services/courseService'
import { useUserStore } from '../../store/slices/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 数据状态
const courseDetail = ref(null)
const loading = ref(false)
const isEnrolled = ref(false)
const enrollLoading = ref(false)
const reviewLoading = ref(false)
const reviewForm = ref({
  rating: 5,
  comment: ''
})

// 获取课程详情
const fetchCourseDetail = async () => {
  loading.value = true
  try {
    const courseId = route.params.id
    const data = await getCourseById(courseId)
    courseDetail.value = data
    
    // 检查报名状态
    if (userStore.isLoggedIn) {
      await checkEnrollStatus()
    }
  } catch (error) {
    console.error('获取课程详情失败:', error)
    ElMessage.error('获取课程详情失败，请稍后重试')
    courseDetail.value = null
  } finally {
    loading.value = false
  }
}

// 检查报名状态
const checkEnrollStatus = async () => {
  try {
    const courseId = route.params.id
    const result = await checkEnrollmentStatus(courseId)
    isEnrolled.value = result.isEnrolled
  } catch (error) {
    console.error('检查报名状态失败:', error)
  }
}

// 处理报名
const handleEnroll = async () => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再报名课程')
    router.push('/login')
    return
  }

  enrollLoading.value = true
  try {
    const courseId = route.params.id
    const result = await enrollCourse(courseId)
    if (result.success) {
      ElMessage.success(result.message || '报名成功！')
      isEnrolled.value = true
      // 更新报名人数
      if (courseDetail.value) {
        courseDetail.value.enrollmentCount = (courseDetail.value.enrollmentCount || 0) + 1
      }
    }
  } catch (error) {
    console.error('报名失败:', error)
    ElMessage.error(error.message || '报名失败，请稍后重试')
  } finally {
    enrollLoading.value = false
  }
}

// 处理取消报名
const handleCancelEnroll = async () => {
  enrollLoading.value = true
  try {
    const courseId = route.params.id
    const result = await cancelEnrollment(courseId)
    if (result.success) {
      ElMessage.success(result.message || '已取消报名')
      isEnrolled.value = false
      // 更新报名人数
      if (courseDetail.value && courseDetail.value.enrollmentCount > 0) {
        courseDetail.value.enrollmentCount = courseDetail.value.enrollmentCount - 1
      }
    }
  } catch (error) {
    console.error('取消报名失败:', error)
    ElMessage.error(error.message || '取消报名失败，请稍后重试')
  } finally {
    enrollLoading.value = false
  }
}

// 处理提交评论
const handleSubmitReview = async () => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再发表评论')
    router.push('/login')
    return
  }

  // 验证评论内容
  if (!reviewForm.value.comment.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  reviewLoading.value = true
  try {
    const courseId = route.params.id
    const result = await submitReview(courseId, {
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment.trim()
    })
    
    if (result.success) {
      ElMessage.success(result.message || '评论发表成功！')
      
      // 将新评论添加到列表顶部
      if (result.review) {
        courseDetail.value.reviews.unshift(result.review)
      }
      
      // 重置表单
      reviewForm.value = {
        rating: 5,
        comment: ''
      }
    }
  } catch (error) {
    console.error('发表评论失败:', error)
    ElMessage.error(error.message || '发表评论失败，请稍后重试')
  } finally {
    reviewLoading.value = false
  }
}

// 格式化时长（秒转为分钟）
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  return `${minutes} 分钟`
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`
  }
  // 小于1天
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`
  }
  // 小于7天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)} 天前`
  }
  
  // 超过7天显示具体日期
  return date.toLocaleDateString('zh-CN')
}

// 页面加载时获取课程详情
onMounted(() => {
  fetchCourseDetail()
})
</script>

<style scoped>
.course-detail-page {
  min-height: calc(100vh - 64px);
  background: #f8f9fa;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #909399;
}

.loading-container p {
  margin-top: 16px;
  font-size: 16px;
}

/* 错误状态 */
.error-container {
  padding: 80px 20px;
}

/* 课程头部 */
.course-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.cover-section {
  flex-shrink: 0;
}

.course-cover {
  width: 400px;
  height: 225px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.info-section {
  flex: 1;
}

.course-title {
  font-size: 36px;
  font-weight: bold;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.course-description {
  font-size: 16px;
  line-height: 1.8;
  margin: 0 0 24px 0;
  opacity: 0.95;
}

.course-meta {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.meta-item .el-icon {
  font-size: 18px;
}

.action-section {
  margin-top: 32px;
}

.enroll-button,
.cancel-button {
  min-width: 160px;
  height: 48px;
  font-size: 18px;
  font-weight: bold;
}

.enroll-button {
  background: white;
  color: #667eea;
  border: none;
}

.enroll-button:hover {
  background: #f0f2ff;
  color: #667eea;
}

.cancel-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 主内容区域 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.content-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片通用样式 */
.el-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.card-header .el-icon {
  font-size: 20px;
  color: #667eea;
}

/* 教师信息卡片 */
.teacher-info {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.teacher-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  flex-shrink: 0;
}

.teacher-details {
  flex: 1;
}

.teacher-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
}

.teacher-bio {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  margin: 0;
}

/* 课程章节列表 */
.lessons-list {
  display: flex;
  flex-direction: column;
}

.lesson-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s;
}

.lesson-item:last-child {
  border-bottom: none;
}

.lesson-item:hover {
  background: #f8f9fa;
  border-radius: 8px;
}

.lesson-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.lesson-info {
  flex: 1;
}

.lesson-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #909399;
}

.lesson-duration {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 评论区 */
.review-form {
  margin-bottom: 24px;
}

.review-form h4 {
  font-size: 16px;
  color: #333;
  margin: 0 0 16px 0;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.rating-input .label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.comment-input {
  margin-bottom: 16px;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.submit-button:hover {
  opacity: 0.9;
}

/* 评论列表 */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  display: flex;
  gap: 16px;
}

.review-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.review-content {
  flex: 1;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.review-user {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.review-comment {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  margin: 0 0 8px 0;
}

.review-time {
  font-size: 13px;
  color: #909399;
}

.empty-reviews {
  padding: 40px 0;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 24px;
  }

  .course-cover {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }

  .course-title {
    font-size: 24px;
  }

  .course-meta {
    flex-direction: column;
    gap: 12px;
  }

  .teacher-info {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .lesson-item {
    gap: 12px;
  }

  .lesson-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .review-item {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

