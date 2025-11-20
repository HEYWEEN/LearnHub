<template>
  <div class="video-player-container">
    <div class="video-wrapper">
      <video
        ref="videoRef"
        class="video-element"
        :src="videoUrl"
        @loadedmetadata="onVideoLoaded"
        @timeupdate="onTimeUpdate"
        @ended="onVideoEnded"
        @error="onVideoError"
        @play="onPlay"
        @pause="onPause"
        controls
        controlsList="nodownload"
      >
        您的浏览器不支持视频播放
      </video>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <el-icon class="is-loading" :size="50">
          <Loading />
        </el-icon>
        <p>视频加载中...</p>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="error-overlay">
        <el-icon :size="50" color="#f56c6c">
          <CircleClose />
        </el-icon>
        <p>视频加载失败</p>
        <el-button @click="reloadVideo" size="small">重新加载</el-button>
      </div>
    </div>
    
    <!-- 播放控制栏 -->
    <div class="controls-bar">
      <div class="control-item">
        <span class="control-label">播放速度：</span>
        <el-select 
          v-model="playbackRate" 
          size="small" 
          style="width: 100px"
          @change="onPlaybackRateChange"
        >
          <el-option label="0.5x" :value="0.5" />
          <el-option label="1.0x" :value="1.0" />
          <el-option label="1.5x" :value="1.5" />
          <el-option label="2.0x" :value="2.0" />
        </el-select>
      </div>
      
      <div class="control-item">
        <span class="control-label">播放进度：</span>
        <span class="control-value">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      </div>
      
      <div class="control-item">
        <span class="control-label">完成度：</span>
        <el-progress 
          :percentage="progressPercentage" 
          :stroke-width="12"
          :color="progressPercentage >= 80 ? '#67c23a' : '#409eff'"
        />
      </div>
      
      <div v-if="autoSaving" class="control-item save-status">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>保存中...</span>
      </div>
      <div v-else-if="lastSaveTime" class="control-item save-status">
        <el-icon color="#67c23a"><CircleCheck /></el-icon>
        <span>已保存</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Loading, CircleClose, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  initialProgress: {
    type: Number,
    default: 0
  },
  chapterId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['progress-save', 'chapter-complete'])

// 视频元素引用
const videoRef = ref(null)

// 视频状态
const loading = ref(true)
const error = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const playbackRate = ref(1.0)
const autoSaving = ref(false)
const lastSaveTime = ref(null)
const isCompleted = ref(false)

// 自动保存定时器
let autoSaveTimer = null
let lastSavedTime = 0

// 计算播放进度百分比
const progressPercentage = ref(0)

// 视频加载完成
const onVideoLoaded = () => {
  loading.value = false
  const video = videoRef.value
  if (video) {
    duration.value = Math.floor(video.duration)
    
    // 恢复到上次播放位置
    if (props.initialProgress > 0 && props.initialProgress < duration.value) {
      video.currentTime = props.initialProgress
      currentTime.value = props.initialProgress
    }
  }
}

// 时间更新
const onTimeUpdate = () => {
  const video = videoRef.value
  if (video) {
    currentTime.value = Math.floor(video.currentTime)
    
    // 计算进度百分比
    if (duration.value > 0) {
      progressPercentage.value = Math.round((currentTime.value / duration.value) * 100)
    }
    
    // 检查是否达到80%完成标准
    if (progressPercentage.value >= 80 && !isCompleted.value) {
      markAsCompleted()
    }
  }
}

// 播放开始 - 启动自动保存
const onPlay = () => {
  startAutoSave()
}

// 暂停 - 立即保存进度
const onPause = () => {
  stopAutoSave()
  saveProgress(true)
}

// 视频播放结束
const onVideoEnded = () => {
  stopAutoSave()
  markAsCompleted()
  saveProgress(true)
}

// 视频加载错误
const onVideoError = () => {
  loading.value = false
  error.value = true
  ElMessage.error('视频加载失败，请检查网络或视频文件')
}

// 重新加载视频
const reloadVideo = () => {
  error.value = false
  loading.value = true
  const video = videoRef.value
  if (video) {
    video.load()
  }
}

// 播放速度变化
const onPlaybackRateChange = () => {
  const video = videoRef.value
  if (video) {
    video.playbackRate = playbackRate.value
  }
}

// 格式化时间
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 启动自动保存（每5秒）
const startAutoSave = () => {
  if (autoSaveTimer) return
  
  autoSaveTimer = setInterval(() => {
    // 避免频繁保存相同进度
    if (Math.abs(currentTime.value - lastSavedTime) >= 5) {
      saveProgress()
    }
  }, 5000)
}

// 停止自动保存
const stopAutoSave = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
    autoSaveTimer = null
  }
}

// 保存进度
const saveProgress = async (force = false) => {
  // 如果正在保存，跳过
  if (autoSaving.value && !force) return
  
  autoSaving.value = true
  lastSavedTime = currentTime.value
  
  try {
    await emit('progress-save', {
      chapterId: props.chapterId,
      currentTime: currentTime.value,
      completed: isCompleted.value
    })
    lastSaveTime.value = new Date()
  } catch (err) {
    console.error('保存进度失败:', err)
  } finally {
    autoSaving.value = false
  }
}

// 标记为已完成
const markAsCompleted = () => {
  if (isCompleted.value) return
  
  isCompleted.value = true
  emit('chapter-complete', props.chapterId)
  ElMessage.success('恭喜完成本章节学习！')
}

// 暴露方法供父组件调用
const pauseAndSave = async () => {
  const video = videoRef.value
  if (video && !video.paused) {
    video.pause()
  }
  stopAutoSave()
  await saveProgress(true)
}

// 监听视频URL变化
watch(() => props.videoUrl, () => {
  loading.value = true
  error.value = false
  currentTime.value = 0
  progressPercentage.value = 0
  isCompleted.value = false
  stopAutoSave()
  
  const video = videoRef.value
  if (video) {
    video.load()
  }
})

// 监听章节ID变化
watch(() => props.chapterId, () => {
  isCompleted.value = false
  currentTime.value = 0
  progressPercentage.value = 0
})

// 组件挂载
onMounted(() => {
  const video = videoRef.value
  if (video) {
    video.playbackRate = playbackRate.value
  }
})

// 组件卸载前保存进度
onBeforeUnmount(() => {
  stopAutoSave()
  saveProgress(true)
})

// 暴露方法
defineExpose({
  pauseAndSave
})
</script>

<style scoped>
.video-player-container {
  display: flex;
  flex-direction: column;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-wrapper {
  position: relative;
  width: 100%;
  background-color: #000;
}

.video-element {
  width: 100%;
  display: block;
  max-height: 600px;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  gap: 16px;
}

.loading-overlay p,
.error-overlay p {
  font-size: 16px;
  margin: 0;
}

.controls-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 20px;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  flex-wrap: wrap;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.control-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.save-status {
  margin-left: auto;
  color: #67c23a;
  font-size: 14px;
}

.save-status .el-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .controls-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .save-status {
    margin-left: 0;
  }
}
</style>

