<template>
  <div class="learning-page">
    <div v-if="loading" class="page-loading">
      <el-icon class="is-loading" :size="50">
        <Loading />
      </el-icon>
      <p>加载课程数据中...</p>
    </div>

    <div v-else-if="error" class="page-error">
      <el-icon :size="60" color="#f56c6c">
        <CircleClose />
      </el-icon>
      <p>{{ error }}</p>
      <el-button type="primary" @click="$router.push('/courses')">
        返回课程列表
      </el-button>
    </div>

    <div v-else class="learning-container">
      <!-- 左侧：章节导航栏 -->
      <div class="sidebar-section">
        <ChapterSidebar
          :chapters="lessons"
          :current-chapter-id="currentLessonId"
          :completed-chapters="completedLessons"
          :course-title="courseTitle"
          @chapter-change="handleLessonChange"
        />
      </div>

      <!-- 右侧：主内容区 -->
      <div class="main-section">
        <!-- 视频播放器 -->
        <div class="video-section">
          <VideoPlayer
            ref="videoPlayerRef"
            :video-url="currentVideoUrl"
            :initial-progress="currentVideoProgress"
            :chapter-id="currentLessonId"
            @progress-save="handleProgressSave"
            @chapter-complete="handleLessonComplete"
          />
        </div>

        <!-- 笔记编辑器 -->
        <div class="notes-section">
          <NotesEditor
            ref="notesEditorRef"
            :content="currentNotes"
            :chapter-id="currentLessonId"
            @save="handleNotesSave"
            @content-change="handleNotesChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Loading, CircleClose } from '@element-plus/icons-vue'
import ChapterSidebar from '../../components/learning/ChapterSidebar.vue'
import VideoPlayer from '../../components/learning/VideoPlayer.vue'
import NotesEditor from '../../components/learning/NotesEditor.vue'
import { 
  getCourseChapters, 
  getVideoProgress, 
  saveVideoProgress,
  getChapterNotes,
  saveChapterNotes,
  getCourseProgress
} from '../../services/learningService'
import { getCourseById } from '../../services/courseService'
import instance from '../../services/axios'

const route = useRoute()
const router = useRouter()

// 组件引用
const videoPlayerRef = ref(null)
const notesEditorRef = ref(null)

// 页面状态
const loading = ref(true)
const error = ref(null)

// 课程数据
const courseId = ref('')
const courseTitle = ref('')
const lessons = ref([])
const currentLessonId = ref('')
const completedLessons = ref([])

// 视频数据
const currentVideoProgress = ref(0)

// 笔记数据
const currentNotes = ref('')
const notesChanged = ref(false)

// 计算当前视频URL
const currentVideoUrl = computed(() => {
  const lesson = lessons.value.find(l => l.id === currentLessonId.value)
  return lesson ? instance.defaults.baseURL + `/courses/${courseId.value}/lesson/${lesson.id}/stream` : ''
})

// 初始化页面
const initPage = async () => {
  try {
    loading.value = true
    error.value = null

    // 获取课程ID
    courseId.value = route.params.courseId
    if (!courseId.value) {
      error.value = '缺少课程ID参数'
      return
    }

    // 获取课程信息
    const courseData = await getCourseById(courseId.value)
    courseTitle.value = courseData.title

    // 获取章节列表
    const lessonsResponse = await getCourseChapters(courseId.value)
    lessons.value = lessonsResponse.data?.lessons || []

    if (lessons.value.length === 0) {
      error.value = '该课程暂无章节内容'
      return
    }

    // 获取课程进度
    const progressData = await getCourseProgress(courseId.value)
    console.log('课程进度数据:', progressData)
    completedLessons.value = progressData?.complete || []

    // 确定当前章节ID
    if (route.params.lessonId) {
      currentLessonId.value = route.params.lessonId
    } else {
      // 默认选择第一章节
      currentLessonId.value = lessons.value[0].id
      // 更新路由，但不触发页面重载
      router.replace({
        name: 'Learning',
        params: {
          courseId: courseId.value,
          lessonId: currentLessonId.value
        }
      })
    }

    // 加载当前章节数据
    await loadLessonData(currentLessonId.value)

  } catch (err) {
    console.error('初始化页面失败:', err)
    error.value = '加载课程数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 加载章节数据
const loadLessonData = async (lessonId) => {
  try {
    // 获取视频进度
    const progressData = await getVideoProgress(courseId.value, lessonId)
    currentVideoProgress.value = progressData.data?.currentTime || 0

    // 获取笔记内容
    const notesData = await getChapterNotes(courseId.value, lessonId)
    if (notesData.notes.length > 0) {
      currentNotes.value = notesData.notes[0].content || ''
    } else {
      currentNotes.value = ''
    }
    notesChanged.value = false

  } catch (err) {
    console.error('加载章节数据失败:', err)
    ElMessage.error('加载章节数据失败')
  }
}

// 处理章节切换
const handleLessonChange = async (lesson) => {
  // 检查笔记是否未保存
  if (notesEditorRef.value && notesEditorRef.value.isDirty()) {
    try {
      await ElMessageBox.confirm(
        '当前章节的笔记尚未保存，是否保存？',
        '提示',
        {
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning',
          distinguishCancelAndClose: true
        }
      )
      // 用户选择保存
      await notesEditorRef.value.forceSave()
    } catch (action) {
      // 用户选择不保存或关闭对话框
      if (action === 'close') {
        return // 取消切换
      }
    }
  }

  // 暂停并保存当前视频进度
  if (videoPlayerRef.value) {
    await videoPlayerRef.value.pauseAndSave()
  }

  // 切换章节
  currentLessonId.value = lesson.id
  
  // 更新路由
  router.push({
    name: 'Learning',
    params: {
      courseId: courseId.value,
      lessonId: lesson.id
    }
  })

  // 加载新章节数据
  await loadLessonData(lesson.id)
}

// 处理视频进度保存
const handleProgressSave = async (data) => {
  try {
    await saveVideoProgress(courseId.value, data.chapterId, {
      currentTime: data.currentTime,
      completed: data.completed
    })
  } catch (err) {
    console.error('保存视频进度失败:', err)
    throw err
  }
}

// 处理章节完成
const handleLessonComplete = (lessonId) => {
  if (!completedLessons.value.includes(lessonId)) {
    completedLessons.value.push(lessonId)
  }
}

// 处理笔记保存
const handleNotesSave = async (data) => {
  try {
    await saveChapterNotes(courseId.value, data.chapterId, data.content)
    notesChanged.value = false
  } catch (err) {
    console.error('保存笔记失败:', err)
    throw err
  }
}

// 处理笔记内容变化
const handleNotesChange = (content) => {
  notesChanged.value = true
}

// 监听路由参数变化
watch(() => route.params.lessonId, (newLessonId) => {
  if (newLessonId && newLessonId !== currentLessonId.value) {
    currentLessonId.value = newLessonId
    loadLessonData(newLessonId)
  }
})

// 页面离开前检查
onBeforeRouteLeave(async (to, from, next) => {
  // 检查笔记是否未保存
  if (notesEditorRef.value && notesEditorRef.value.isDirty()) {
    try {
      await ElMessageBox.confirm(
        '您有未保存的笔记，是否保存后离开？',
        '提示',
        {
          confirmButtonText: '保存并离开',
          cancelButtonText: '直接离开',
          type: 'warning',
          distinguishCancelAndClose: true
        }
      )
      // 保存笔记
      await notesEditorRef.value.forceSave()
      next()
    } catch (action) {
      if (action === 'cancel') {
        // 用户选择直接离开
        next()
      } else {
        // 用户取消离开
        next(false)
      }
    }
  } else {
    next()
  }

  // 保存视频进度
  if (videoPlayerRef.value) {
    await videoPlayerRef.value.pauseAndSave()
  }
})

// 页面卸载前保存
const handleBeforeUnload = (event) => {
  if (notesEditorRef.value && notesEditorRef.value.isDirty()) {
    event.preventDefault()
    event.returnValue = '您有未保存的笔记，确定要离开吗？'
  }
}

// 组件挂载
onMounted(() => {
  initPage()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// 组件卸载
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
.learning-page {
  width: 100%;
  height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
}

.page-loading,
.page-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
}

.page-loading p,
.page-error p {
  font-size: 16px;
  color: #606266;
}

.learning-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 100vh;
  overflow: hidden;
}

.sidebar-section {
  height: 100vh;
  overflow: hidden;
  border-right: 1px solid #e4e7ed;
}

.main-section {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f7fa;
  padding: 20px;
  gap: 20px;
}

.video-section {
  flex-shrink: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.notes-section {
  flex: 1;
  min-height: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .learning-container {
    grid-template-columns: 280px 1fr;
  }
}

@media (max-width: 768px) {
  .learning-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .sidebar-section {
    height: auto;
    max-height: 40vh;
  }

  .main-section {
    height: auto;
    padding: 12px;
    gap: 12px;
  }
}
</style>

