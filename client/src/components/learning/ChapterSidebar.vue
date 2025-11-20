<template>
  <div class="chapter-sidebar">
    <!-- 课程信息头部 -->
    <div class="course-header">
      <div class="course-info">
        <h3 class="course-title">{{ courseTitle }}</h3>
        <div class="progress-info">
          <el-progress 
            :percentage="progressPercentage" 
            :stroke-width="8"
            :show-text="false"
          />
          <span class="progress-text">
            已完成 {{ completedCount }}/{{ totalCount }} 章节
          </span>
        </div>
      </div>
    </div>

    <!-- 章节列表 -->
    <div class="chapters-container">
      <div class="chapters-list">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          :class="[
            'chapter-item',
            { 'active': isCurrentChapter(chapter.id) },
            { 'completed': isCompleted(chapter.id) }
          ]"
          @click="handleChapterClick(chapter)"
        >
          <div class="chapter-order">{{ chapter.order }}</div>
          <div class="chapter-content">
            <div class="chapter-title">{{ chapter.title }}</div>
            <div class="chapter-duration">{{ formatDuration(chapter.duration) }}</div>
          </div>
          <div class="chapter-status">
            <el-icon v-if="isCompleted(chapter.id)" class="completed-icon">
              <CircleCheck />
            </el-icon>
            <el-icon v-else-if="isCurrentChapter(chapter.id)" class="playing-icon">
              <VideoPlay />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CircleCheck, VideoPlay } from '@element-plus/icons-vue'

const props = defineProps({
  chapters: {
    type: Array,
    required: true,
    default: () => []
  },
  currentChapterId: {
    type: String,
    default: ''
  },
  completedChapters: {
    type: Array,
    default: () => []
  },
  courseTitle: {
    type: String,
    default: '课程标题'
  }
})

const emit = defineEmits(['chapter-change'])

// 计算已完成章节数量
const completedCount = computed(() => props.completedChapters.length)

// 计算总章节数
const totalCount = computed(() => props.chapters.length)

// 计算进度百分比
const progressPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

// 判断是否为当前章节
const isCurrentChapter = (chapterId) => {
  return props.currentChapterId === chapterId
}

// 判断章节是否已完成
const isCompleted = (chapterId) => {
  return props.completedChapters.includes(chapterId)
}

// 格式化时长（秒 -> 分:秒）
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 处理章节点击
const handleChapterClick = (chapter) => {
  if (chapter.id !== props.currentChapterId) {
    emit('chapter-change', chapter)
  }
}
</script>

<style scoped>
.chapter-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
}

.course-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: white;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.chapters-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.chapters-list {
  display: flex;
  flex-direction: column;
}

.chapter-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  position: relative;
}

.chapter-item:hover {
  background-color: #f5f7fa;
}

.chapter-item.active {
  background-color: #ecf5ff;
  border-left-color: #409eff;
}

.chapter-item.active .chapter-title {
  color: #409eff;
  font-weight: 600;
}

.chapter-item.completed .chapter-order {
  background-color: #67c23a;
  color: white;
}

.chapter-order {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e4e7ed;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.chapter-content {
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
}

.chapter-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-duration {
  font-size: 12px;
  color: #909399;
}

.chapter-status {
  flex-shrink: 0;
  margin-left: 8px;
}

.completed-icon {
  color: #67c23a;
  font-size: 20px;
}

.playing-icon {
  color: #409eff;
  font-size: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 滚动条样式 */
.chapters-container::-webkit-scrollbar {
  width: 6px;
}

.chapters-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chapters-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chapters-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

