<template>
  <div class="student-management-page">
    <div class="page-container">
      <div class="page-header">
        <h1>学生管理</h1>
      </div>

      <div class="filter-section">
        <el-select
          v-model="selectedCourseId"
          placeholder="选择课程筛选"
          @change="handleCourseChange"
          clearable
          style="width: 300px"
        >
          <el-option label="全部课程" value="" />
          <el-option
            v-for="course in teacherCourses"
            :key="course.id"
            :label="course.title"
            :value="course.id"
          />
        </el-select>
      </div>

      <div v-loading="loading" class="students-section">
        <div v-if="students.length === 0" class="empty-state">
          <div class="empty-icon">👥</div>
          <p class="empty-text">暂无学生报名</p>
        </div>

        <div v-else class="students-table">
          <el-table :data="students" stripe style="width: 100%">
            <el-table-column label="学生信息" min-width="200">
              <template #default="{ row }">
                <div class="student-info">
                  <img
                    :src="row.student.avatar || defaultAvatar"
                    :alt="row.student.username"
                    class="student-avatar"
                  />
                  <div class="student-details">
                    <div class="student-name">{{ row.student.username }}</div>
                    <div class="student-email">{{ row.student.email }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="报名课程" prop="course.title" min-width="180" />

            <el-table-column label="报名时间" min-width="150">
              <template #default="{ row }">
                {{ formatDate(row.enrolledAt) }}
              </template>
            </el-table-column>

            <el-table-column label="学习进度" min-width="150">
              <template #default="{ row }">
                <div class="progress-container">
                  <el-progress
                    :percentage="row.progress"
                    :color="getProgressColor(row.progress)"
                  />
                </div>
              </template>
            </el-table-column>

            <el-table-column label="完成章节" min-width="120" align="center">
              <template #default="{ row }">
                <span class="chapter-count">
                  {{ row.completedChapters }} / {{ row.totalChapters }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="笔记数量" min-width="100" align="center">
              <template #default="{ row }">
                <span class="notes-count">{{ row.notesCount }}</span>
              </template>
            </el-table-column>

            <el-table-column label="最后学习时间" min-width="150">
              <template #default="{ row }">
                {{ formatDate(row.lastStudyTime) }}
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button
                  size="small"
                  type="primary"
                  link
                  @click="handleViewDetails(row)"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 学生详细信息对话框 -->
      <el-dialog
        v-model="detailDialogVisible"
        :title="`${selectedStudent?.student.username} 的学习详情`"
        width="700px"
      >
        <div v-if="selectedStudent" class="student-detail-content">
          <div class="detail-section">
            <h3>基本信息</h3>
            <div class="detail-item">
              <span class="label">课程名称：</span>
              <span class="value">{{ selectedStudent.course.title }}</span>
            </div>
            <div class="detail-item">
              <span class="label">报名时间：</span>
              <span class="value">{{ formatDate(selectedStudent.enrolledAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">总体进度：</span>
              <span class="value">{{ selectedStudent.progress }}%</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>学习统计</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">已完成章节</div>
                <div class="stat-value">
                  {{ selectedStudent.completedChapters }} / {{ selectedStudent.totalChapters }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">笔记数量</div>
                <div class="stat-value">{{ selectedStudent.notesCount }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">最后学习</div>
                <div class="stat-value">{{ formatDate(selectedStudent.lastStudyTime) }}</div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/slices/user'
import { getTeacherCourses } from '@/services/courseService'
import { getEnrolledStudents } from '@/services/teacherService'
import defaultAvatar from '@/assets/images/default-avatar.png'

const userStore = useUserStore()

const loading = ref(false)
const teacherCourses = ref([])
const selectedCourseId = ref('')
const students = ref([])
const detailDialogVisible = ref(false)
const selectedStudent = ref(null)

// 加载教师的课程
const loadTeacherCourses = async () => {
  try {
    const result = await getTeacherCourses(userStore.user.id)
    if (result.success) {
      teacherCourses.value = result.courses
    }
  } catch (error) {
    console.error('加载课程列表失败:', error)
  }
}

// 加载学生列表
const loadStudents = async () => {
  loading.value = true
  try {
    const result = await getEnrolledStudents(
      userStore.user.id,
      selectedCourseId.value || null
    )
    if (result.success) {
      students.value = result.data
    }
  } catch (error) {
    console.error('加载学生列表失败:', error)
    ElMessage.error('加载学生列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTeacherCourses()
  loadStudents()
})

const handleCourseChange = () => {
  loadStudents()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getProgressColor = (progress) => {
  if (progress >= 80) return '#67c23a'
  if (progress >= 50) return '#409eff'
  if (progress >= 30) return '#e6a23c'
  return '#f56c6c'
}

const handleViewDetails = (student) => {
  selectedStudent.value = student
  detailDialogVisible.value = true
}
</script>

<style scoped>
.student-management-page {
  min-height: calc(100vh - 64px);
  background-color: #f5f7fa;
  padding: 40px 20px;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.students-section {
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
}

/* 学生表格 */
.students-table {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.student-details {
  flex: 1;
}

.student-name {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.student-email {
  font-size: 12px;
  color: #7f8c8d;
}

.progress-container {
  padding-right: 12px;
}

.chapter-count {
  font-size: 14px;
  font-weight: 500;
  color: #409eff;
}

.notes-count {
  font-size: 14px;
  font-weight: 500;
  color: #67c23a;
}

/* 详情对话框 */
.student-detail-content {
  padding: 20px 0;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8e8e8;
}

.detail-item {
  display: flex;
  margin-bottom: 12px;
}

.detail-item .label {
  width: 100px;
  font-weight: 500;
  color: #606266;
}

.detail-item .value {
  flex: 1;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }

  .filter-section {
    padding: 16px;
  }

  .students-table {
    padding: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

