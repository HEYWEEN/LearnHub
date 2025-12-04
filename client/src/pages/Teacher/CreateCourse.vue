<template>
  <div class="create-course-page">
    <div class="page-container">
      <div class="page-header">
        <h1>{{ isEditMode ? '编辑课程' : '创建课程' }}</h1>
        <el-button @click="handleBack">返回</el-button>
      </div>

      <div class="form-container">
        <el-form
          ref="formRef"
          :model="courseForm"
          :rules="formRules"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="课程标题" prop="title">
            <el-input
              v-model="courseForm.title"
              placeholder="请输入课程标题"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="课程描述" prop="description">
            <el-input
              v-model="courseForm.description"
              type="textarea"
              placeholder="请输入课程描述"
              :rows="5"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="课程类别" prop="category">
            <el-select v-model="courseForm.category" placeholder="请选择课程类别">
              <el-option label="前端开发" value="前端开发" />
              <el-option label="后端开发" value="后端开发" />
              <el-option label="移动开发" value="移动开发" />
              <el-option label="数据科学" value="数据科学" />
              <el-option label="人工智能" value="人工智能" />
              <el-option label="数据库" value="数据库" />
              <el-option label="DevOps" value="DevOps" />
              <el-option label="网络安全" value="网络安全" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>

          <el-form-item label="课程封面" prop="coverImage">
            <el-input
              v-model="courseForm.coverImage"
              placeholder="请输入课程封面URL（可选，留空使用默认封面）"
            />
            <div v-if="courseForm.coverImage" class="cover-preview">
              <img :src="courseForm.coverImage" alt="课程封面预览" @error="handleImageError" />
            </div>
          </el-form-item>

          <el-form-item label="预览视频" prop="videoPreview">
            <el-input
              v-model="courseForm.videoPreview"
              placeholder="请输入预览视频URL（可选）"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">
              {{ isEditMode ? '保存修改' : '创建课程' }}
            </el-button>
            <el-button @click="handleBack">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/slices/user'
import { createCourse, updateCourse, getCourseById } from '@/services/courseService'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref(null)
const submitting = ref(false)
const isEditMode = ref(false)

const courseForm = reactive({
  title: '',
  description: '',
  category: '',
  coverImage: '',
  videoPreview: ''
})

const formRules = {
  title: [
    { required: true, message: '请输入课程标题', trigger: 'blur' },
    { min: 3, max: 100, message: '标题长度在 3 到 100 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入课程描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择课程类别', trigger: 'change' }
  ]
}

// 加载课程数据（编辑模式）
const loadCourseData = async (courseId) => {
  try {
    const result = await getCourseById(courseId)
    courseForm.title = result.title
    courseForm.description = result.description
    courseForm.category = result.category
    courseForm.coverImage = result.coverImage
    courseForm.videoPreview = result.videoPreview || ''
  } catch (error) {
    console.error('加载课程数据失败:', error)
    ElMessage.error('加载课程数据失败')
    handleBack()
  }
}

onMounted(() => {
  // 检查是否为编辑模式
  if (route.query.courseId) {
    isEditMode.value = true
    loadCourseData(route.query.courseId)
  }
})

const handleImageError = (e) => {
  e.target.src = '/src/assets/images/default-course.png'
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      // 直接传递表单数据，不需要包含instructor（后端从token获取）
      const courseData = {
        title: courseForm.title,
        description: courseForm.description,
        category: courseForm.category,
        coverImage: courseForm.coverImage,
        videoPreview: courseForm.videoPreview
      }
      
      if (isEditMode.value) {
        await updateCourse(route.query.courseId, courseData)
        ElMessage.success('课程更新成功！')
      } else {
        await createCourse(courseData)
        ElMessage.success('课程创建成功！')
      }
      
      router.push('/teacher/courses/manage')
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error(error.response?.data?.message || error.message || '操作失败，请稍后重试')
    } finally {
      submitting.value = false
    }
  })
}

const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.create-course-page {
  min-height: calc(100vh - 64px);
  background-color: #f5f7fa;
  padding: 40px 20px;
}

.page-container {
  max-width: 900px;
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

.form-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.cover-preview {
  margin-top: 12px;
  width: 200px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #2c3e50;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-select) {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-container {
    padding: 24px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
}
</style>

