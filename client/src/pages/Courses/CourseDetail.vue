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
              :src="courseDetail.coverImage? FILE_UPLOAD_URL + courseDetail.coverImage : defaultCourse" 
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

            <div class="action-section" v-if="!userStore.isTeacher">
              <!-- 学生显示报名和取消按钮 -->
              <el-button
                v-if="!isEnrolled"
                type="primary"
                size="large"
                class="action-button enroll-button"
                :loading="enrollLoading"
                @click="handleEnroll"
              >
                立即报名
              </el-button>
              <template v-else>
                <el-button
                  type="danger"
                  size="large"
                  plain
                  class="action-button cancel-button"
                  :loading="enrollLoading"
                  @click="handleCancelEnroll"
                >
                  取消报名
                </el-button>
                <el-button
                  v-if="courseDetail.lessons && courseDetail.lessons.length > 0"
                  type="primary"
                  size="large"
                  class="action-button start-button"
                  @click="handleStartLearning(courseDetail.lessons[0])"
                >
                  开始学习
                </el-button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <div class="content-left">
          <!-- 教师信息卡片 -->
          <el-card class="teacher-card fade-in" shadow="hover" style="animation-delay: 0.2s">
            <template #header>
              <div class="card-header">
                <el-icon><UserFilled /></el-icon>
                <span>授课教师</span>
              </div>
            </template>
            <div class="teacher-info">
              <img 
                :src="courseDetail.instructor.avatar? FILE_UPLOAD_URL + courseDetail.instructor.avatar : defaultAvatar" 
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
          <el-card class="lessons-card fade-in" shadow="hover" style="animation-delay: 0.3s">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon><List /></el-icon>
                  <span>课程章节</span>
                </div>
                <!-- 教师管理按钮 -->
                <el-button
                  v-if="isTeacherOfCourse"
                  type="primary"
                  size="small"
                  @click="handleAddLesson"
                >
                  <el-icon><Plus /></el-icon>
                  添加章节
                </el-button>
              </div>
            </template>
            <div class="lessons-list">
              <div 
                v-if="courseDetail.lessons && courseDetail.lessons.length > 0"
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
                    <span v-if="lesson.description" class="lesson-description">
                      {{ lesson.description }}
                    </span>
                  </div>
                </div>
                <!-- 教师显示管理按钮 -->
                <div v-if="isTeacherOfCourse" class="lesson-actions">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleStartLearning(lesson)"
                  >
                    查看视频
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleEditLesson(lesson)"
                  >
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleUploadVideo(lesson)"
                  >
                    <el-icon><Upload /></el-icon>
                    更换视频
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="handleDeleteLesson(lesson)"
                  >
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </div>
                <!-- 教师（非课程创建者）显示查看视频按钮 -->
                <el-button
                  v-else-if="userStore.isTeacher"
                  type="primary"
                  size="small"
                  class="start-learning-btn"
                  @click="handleStartLearning(lesson)"
                >
                  查看视频
                </el-button>
                <!-- 学生显示开始学习或请先报名 -->
                <el-button
                  v-else-if="isEnrolled"
                  type="primary"
                  size="small"
                  class="start-learning-btn"
                  @click="handleStartLearning(lesson)"
                >
                  开始学习
                </el-button>
                <el-button
                  v-else
                  type="info"
                  size="small"
                  class="start-learning-btn"
                  disabled
                >
                  请先报名
                </el-button>
              </div>
              <div v-else class="empty-lessons">
                <el-empty description="该课程暂无章节内容" />
              </div>
            </div>
          </el-card>

          <!-- 章节编辑对话框 -->
          <el-dialog
            v-model="lessonDialogVisible"
            :title="lessonDialogMode === 'add' ? '添加章节' : '编辑章节'"
            width="600px"
            :close-on-click-modal="false"
          >
            <el-form
              ref="lessonFormRef"
              :model="lessonForm"
              :rules="lessonFormRules"
              label-width="100px"
            >
              <el-form-item label="章节标题" prop="title">
                <el-input
                  v-model="lessonForm.title"
                  placeholder="请输入章节标题"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="章节描述" prop="description">
                <el-input
                  v-model="lessonForm.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入章节描述（可选）"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="lessonDialogVisible = false">取消</el-button>
              <el-button
                type="primary"
                :loading="lessonSubmitting"
                @click="handleLessonSubmit"
              >
                确定
              </el-button>
            </template>
          </el-dialog>

          <!-- 视频上传对话框 -->
          <el-dialog
            v-model="videoDialogVisible"
            title="上传/更换视频"
            width="500px"
            :close-on-click-modal="false"
          >
            <div class="video-upload-container">
              <el-upload
                ref="videoUploadRef"
                :auto-upload="false"
                :limit="1"
                :on-change="handleVideoChange"
                :on-exceed="handleVideoExceed"
                accept="video/*"
                drag
              >
                <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                <div class="el-upload__text">
                  将视频文件拖到此处，或<em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持 MP4, AVI, MOV 等格式，建议大小不超过 500MB
                  </div>
                </template>
              </el-upload>
              <el-progress
                v-if="videoUploadProgress > 0"
                :percentage="videoUploadProgress"
                :status="videoUploadProgress === 100 ? 'success' : undefined"
              />
            </div>
            <template #footer>
              <el-button @click="videoDialogVisible = false">取消</el-button>
              <el-button
                type="primary"
                :loading="videoUploading"
                :disabled="!selectedVideoFile"
                @click="handleVideoUploadSubmit"
              >
                上传
              </el-button>
            </template>
          </el-dialog>

          <!-- 评论区 -->
          <el-card class="reviews-card fade-in" shadow="hover" style="animation-delay: 0.4s">
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
                  :src="review.user_avatar? FILE_UPLOAD_URL + review.user_avatar : defaultAvatar" 
                  :alt="review.user_name"
                  class="review-avatar"
                />
                <div class="review-content">
                  <div class="review-header">
                    <span class="review-user">{{ review.user_name }}</span>
                    <el-rate 
                      v-model="review.rating" 
                      disabled 
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      size="small"
                    />
                  </div>
                  <p class="review-comment">{{ review.comment }}</p>
                  <span class="review-time">{{ formatDate(review.created_at) }}</span>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Loading, User, Document, Folder, UserFilled, List, Clock, 
  ChatDotRound, Plus, Edit, Delete, Upload, UploadFilled
} from '@element-plus/icons-vue'
import { 
  getCourseById, 
  enrollCourse, 
  cancelEnrollment, 
  checkEnrollmentStatus,
  submitReview,
  addLesson,
  updateLesson,
  deleteLesson,
  uploadLessonVideo
} from '../../services/courseService'
import { useUserStore } from '../../store/slices/user'
import { FILE_UPLOAD_URL } from '../../services/axios'
import defaultAvatar from '../../assets/images/default-avatar.png'
import defaultCourse from '../../assets/images/default-course.png'
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

// 章节管理相关状态
const lessonDialogVisible = ref(false)
const lessonDialogMode = ref('add') // 'add' 或 'edit'
const currentLesson = ref(null) // 当前编辑的章节
const lessonSubmitting = ref(false)
const lessonFormRef = ref(null)
const lessonForm = ref({
  title: '',
  description: ''
})
const lessonFormRules = {
  title: [
    { required: true, message: '请输入章节标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ]
}

// 视频上传相关状态
const videoDialogVisible = ref(false)
const videoUploading = ref(false)
const videoUploadProgress = ref(0)
const selectedVideoFile = ref(null)
const currentVideoLesson = ref(null) // 当前要上传视频的章节
const videoUploadRef = ref(null)

// 计算属性：判断当前用户是否是课程创建者
const isTeacherOfCourse = computed(() => {
  return userStore.isTeacher && 
         courseDetail.value && 
         courseDetail.value.instructor && 
         courseDetail.value.instructor.id === userStore.user?.id
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

// 处理开始学习
const handleStartLearning = (lesson) => {
  const courseId = route.params.id
  // 跳转到学习空间页面，指定具体章节
  router.push({
    name: 'Learning',
    params: {
      courseId: courseId,
      lessonId: lesson.id
    }
  })
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
      if (result.data) {
        courseDetail.value.reviews.unshift(result.data)
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

// 打开添加章节对话框
const handleAddLesson = () => {
  lessonDialogMode.value = 'add'
  lessonForm.value = {
    title: '',
    description: ''
  }
  currentLesson.value = null
  lessonDialogVisible.value = true
}

// 打开编辑章节对话框
const handleEditLesson = (lesson) => {
  lessonDialogMode.value = 'edit'
  lessonForm.value = {
    title: lesson.title,
    description: lesson.description || ''
  }
  currentLesson.value = lesson
  lessonDialogVisible.value = true
}

// 提交章节表单（添加或编辑）
const handleLessonSubmit = async () => {
  if (!lessonFormRef.value) return
  
  await lessonFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    lessonSubmitting.value = true
    try {
      const courseId = route.params.id
      
      if (lessonDialogMode.value === 'add') {
        // 添加章节
        const result = await addLesson(courseId, lessonForm.value)
        if (result.success) {
          ElMessage.success('章节添加成功！')
          lessonDialogVisible.value = false
          // 重新获取课程详情以刷新章节列表
          await fetchCourseDetail()
        }
      } else {
        // 编辑章节
        const result = await updateLesson(courseId, currentLesson.value.id, lessonForm.value)
        if (result.success) {
          ElMessage.success('章节更新成功！')
          lessonDialogVisible.value = false
          // 重新获取课程详情以刷新章节列表
          await fetchCourseDetail()
        }
      }
    } catch (error) {
      console.error('章节操作失败:', error)
      ElMessage.error(error.message || '操作失败，请稍后重试')
    } finally {
      lessonSubmitting.value = false
    }
  })
}

// 删除章节
const handleDeleteLesson = async (lesson) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除章节"${lesson.title}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const courseId = route.params.id
    const result = await deleteLesson(courseId, lesson.id)
    if (result.success) {
      ElMessage.success('章节删除成功！')
      // 重新获取课程详情以刷新章节列表
      await fetchCourseDetail()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除章节失败:', error)
      ElMessage.error(error.message || '删除失败，请稍后重试')
    }
  }
}

// 打开视频上传对话框
const handleUploadVideo = (lesson) => {
  currentVideoLesson.value = lesson
  selectedVideoFile.value = null
  videoUploadProgress.value = 0
  videoDialogVisible.value = true
}

// 处理视频文件选择
const handleVideoChange = (file) => {
  selectedVideoFile.value = file.raw
}

// 处理视频文件超出限制
const handleVideoExceed = () => {
  ElMessage.warning('只能上传一个视频文件')
}

// 提交视频上传
const handleVideoUploadSubmit = async () => {
  if (!selectedVideoFile.value) {
    ElMessage.warning('请选择要上传的视频文件')
    return
  }
  
  videoUploading.value = true
  videoUploadProgress.value = 0
  
  try {
    const courseId = route.params.id
    const lessonId = currentVideoLesson.value.id
    
    const result = await uploadLessonVideo(
      courseId, 
      lessonId, 
      selectedVideoFile.value,
      (progressEvent) => {
        // 计算上传进度
        videoUploadProgress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
      }
    )
    
    if (result.success) {
      ElMessage.success('视频上传成功！')
      videoDialogVisible.value = false
      // 清理上传组件
      if (videoUploadRef.value) {
        videoUploadRef.value.clearFiles()
      }
      // 重新获取课程详情以刷新章节列表
      await fetchCourseDetail()
    }
  } catch (error) {
    console.error('视频上传失败:', error)
    ElMessage.error(error.message || '视频上传失败，请稍后重试')
  } finally {
    videoUploading.value = false
  }
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

.action-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-button {
  min-width: 140px;
  font-size: 16px;
  font-weight: 600;
}

.enroll-button,
.start-button {
  background: white;
  color: #667eea;
  border: none;
}

.enroll-button:hover,
.start-button:hover {
  background: #f0f2ff;
  color: #667eea;
}

.cancel-button {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: white;
  color: white;
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
  justify-content: space-between;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.card-header .header-left {
  display: flex;
  align-items: center;
  gap: 8px;
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
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #909399;
}

.lesson-duration {
  display: flex;
  align-items: center;
  gap: 4px;
}

.lesson-description {
  font-size: 13px;
  color: #909399;
}

.start-learning-btn {
  flex-shrink: 0;
}

.lesson-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.lesson-actions .el-button {
  padding: 5px 10px;
}

/* 视频上传容器 */
.video-upload-container {
  padding: 20px 0;
}

.video-upload-container .el-progress {
  margin-top: 20px;
}

/* 对话框样式优化 */
:deep(.el-dialog__header) {
  border-bottom: 1px solid #eee;
  padding: 20px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #eee;
  padding: 15px 20px;
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

.empty-reviews,
.empty-lessons {
  padding: 40px 0;
  text-align: center;
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
    flex-wrap: wrap;
  }

  .lesson-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .lesson-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .review-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>

