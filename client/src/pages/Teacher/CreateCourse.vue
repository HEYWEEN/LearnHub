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
            <el-upload
              class="cover-uploader"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleCoverChange"
              accept="image/*"
            >
              <div v-if="coverPreview" class="cover-preview">
                <img :src="coverPreview" alt="课程封面预览" />
                <div class="preview-overlay">
                  <span>点击更换封面</span>
                </div>
              </div>
              <div v-else class="upload-placeholder">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <div class="upload-text">点击上传课程封面</div>
                <div class="upload-hint">支持 JPG、PNG 格式，建议尺寸 800x450</div>
              </div>
            </el-upload>
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
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/slices/user'
import { createCourse, updateCourse, getCourseById, uploadCoverImage } from '@/services/courseService'
import { FILE_UPLOAD_URL } from '@/services/axios'

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
  coverImage: ''
})

// 文件上传相关
const coverFile = ref(null)
const coverPreview = ref('')

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

// 文件上传处理
const handleCoverChange = (uploadFile) => {
  coverFile.value = uploadFile.raw
  // 生成预览
  const reader = new FileReader()
  reader.onload = (e) => {
    coverPreview.value = e.target.result
  }
  reader.readAsDataURL(uploadFile.raw)
}

// 加载课程数据（编辑模式）
const loadCourseData = async (courseId) => {
  try {
    const result = await getCourseById(courseId)
    courseForm.title = result.title
    courseForm.description = result.description
    courseForm.category = result.category
    courseForm.coverImage = result.coverImage
    
    // 如果有封面，显示预览
    if (result.coverImage) {
      coverPreview.value = FILE_UPLOAD_URL + result.coverImage
    }
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
        category: courseForm.category
      }
      
      let courseId = route.query.courseId
      
      if (isEditMode.value) {
        await updateCourse(courseId, courseData)
      } else {
        const result = await createCourse(courseData)
        courseId = result.id || result.course_id
      }
      
      // 上传封面图片
      if (coverFile.value) {
        try {
          await uploadCoverImage(courseId, coverFile.value)
        } catch (error) {
          console.error('封面上传失败:', error)
          ElMessage.warning('课程保存成功，但封面上传失败')
        }
      }
      
      ElMessage.success(isEditMode.value ? '课程更新成功！' : '课程创建成功！')
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

/* 上传组件样式 */
.cover-uploader,
.video-uploader {
  width: 100%;
}

.upload-placeholder {
  width: 100%;
  height: 180px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fafafa;
}

.upload-placeholder:hover {
  border-color: #667eea;
  background-color: #f5f7ff;
}

.upload-icon {
  font-size: 48px;
  color: #8c939d;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #909399;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
  font-size: 14px;
}

.cover-preview:hover .preview-overlay {
  opacity: 1;
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

