<template>
  <div class="notes-editor">
    <div class="editor-header">
      <div class="header-left">
        <el-icon :size="20"><Document /></el-icon>
        <span class="header-title">学习笔记</span>
      </div>
      <div class="header-right">
        <div v-if="saving" class="save-status">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>保存中...</span>
        </div>
        <div v-else-if="isDirty" class="save-status unsaved">
          <el-icon><Warning /></el-icon>
          <span>未保存</span>
        </div>
        <div v-else-if="lastSavedTime" class="save-status saved">
          <el-icon><CircleCheck /></el-icon>
          <span>已保存</span>
        </div>
        <el-button 
          type="primary" 
          size="small" 
          :loading="saving"
          :disabled="!isDirty"
          @click="handleSave"
        >
          保存笔记
        </el-button>
      </div>
    </div>

    <div class="editor-container">
      <!-- 编辑区 -->
      <div class="editor-panel">
        <div class="panel-header">
          <el-icon><Edit /></el-icon>
          <span>编辑</span>
        </div>
        <textarea
          ref="textareaRef"
          v-model="localContent"
          class="editor-textarea"
          placeholder="在此输入Markdown格式的笔记...&#10;&#10;支持语法：&#10;# 标题&#10;**粗体** *斜体*&#10;- 列表项&#10;```代码块```&#10;[链接](url)"
          @input="onContentChange"
          @focus="onTextareaFocus"
          @blur="onTextareaBlur"
        />
      </div>

      <!-- 预览区 -->
      <div class="preview-panel">
        <div class="panel-header">
          <el-icon><View /></el-icon>
          <span>预览</span>
        </div>
        <div 
          v-if="localContent.trim()"
          class="preview-content markdown-body" 
          v-html="renderedMarkdown"
        />
        <div v-else class="preview-empty">
          <el-icon :size="48"><DocumentAdd /></el-icon>
          <p>开始编写笔记，实时预览将显示在这里</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { Document, Edit, View, Loading, CircleCheck, Warning, DocumentAdd } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  chapterId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['save', 'content-change'])

// 本地内容
const localContent = ref('')
const saving = ref(false)
const isDirty = ref(false)
const lastSavedTime = ref(null)
const textareaRef = ref(null)

// 自动保存定时器
let autoSaveTimer = null

// 配置 marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('代码高亮失败:', err)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

// 渲染 Markdown
const renderedMarkdown = computed(() => {
  try {
    return marked(localContent.value)
  } catch (err) {
    console.error('Markdown解析失败:', err)
    return '<p>Markdown解析失败</p>'
  }
})

// 内容变化处理
const onContentChange = () => {
  isDirty.value = true
  emit('content-change', localContent.value)
  
  // 重置自动保存定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  
  // 10秒后自动保存
  autoSaveTimer = setTimeout(() => {
    if (isDirty.value) {
      handleAutoSave()
    }
  }, 10000)
}

// textarea 获得焦点
const onTextareaFocus = () => {
  // 确保 textarea 可以正常输入
  if (textareaRef.value) {
    textareaRef.value.style.pointerEvents = 'auto'
  }
}

// textarea 失去焦点
const onTextareaBlur = () => {
  // 可以在这里添加失去焦点时的处理
}

// 手动保存
const handleSave = async () => {
  if (!isDirty.value) return
  
  saving.value = true
  
  try {
    await emit('save', {
      chapterId: props.chapterId,
      content: localContent.value
    })
    
    isDirty.value = false
    lastSavedTime.value = new Date()
    ElMessage.success('笔记保存成功')
  } catch (err) {
    console.error('保存笔记失败:', err)
    ElMessage.error('笔记保存失败')
  } finally {
    saving.value = false
  }
}

// 自动保存
const handleAutoSave = async () => {
  if (!isDirty.value) return
  
  saving.value = true
  
  try {
    await emit('save', {
      chapterId: props.chapterId,
      content: localContent.value
    })
    
    isDirty.value = false
    lastSavedTime.value = new Date()
  } catch (err) {
    console.error('自动保存笔记失败:', err)
  } finally {
    saving.value = false
  }
}

// 检查是否有未保存的内容
const checkUnsaved = () => {
  return isDirty.value
}

// 强制保存
const forceSave = async () => {
  if (!isDirty.value) return true
  
  try {
    await handleSave()
    return true
  } catch (err) {
    return false
  }
}

// 监听外部内容变化
watch(() => props.content, (newContent) => {
  // 只在非脏状态下更新本地内容，避免覆盖用户正在编辑的内容
  if (!isDirty.value) {
    localContent.value = newContent
  }
}, { immediate: true })

// 监听章节ID变化
watch(() => props.chapterId, () => {
  isDirty.value = false
  lastSavedTime.value = null
  
  // 清除自动保存定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
})

// 组件挂载
onMounted(() => {
  localContent.value = props.content
})

// 组件卸载前清理
onBeforeUnmount(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
})

// 暴露方法
defineExpose({
  checkUnsaved,
  forceSave,
  isDirty: () => isDirty.value
})
</script>

<style scoped>
.notes-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fafafa;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #67c23a;
}

.save-status.unsaved {
  color: #e6a23c;
}

.save-status.saved {
  color: #67c23a;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  flex: 1;
  overflow: hidden;
  background-color: #e4e7ed;
}

.editor-panel,
.preview-panel {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.editor-textarea {
  flex: 1;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
  overflow-y: auto;
  background-color: #fff;
  /* 确保可以正常输入 */
  pointer-events: auto;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.editor-textarea::placeholder {
  color: #c0c4cc;
  line-height: 1.6;
}

.preview-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  line-height: 1.6;
}

.preview-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  gap: 16px;
}

.preview-empty p {
  margin: 0;
  font-size: 14px;
}

/* Markdown 样式 */
.markdown-body {
  font-size: 14px;
  color: #303133;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #303133;
}

.markdown-body h1 {
  font-size: 28px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.markdown-body h2 {
  font-size: 24px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.markdown-body h3 {
  font-size: 20px;
}

.markdown-body h4 {
  font-size: 18px;
}

.markdown-body p {
  margin-bottom: 16px;
}

.markdown-body code {
  padding: 2px 6px;
  background-color: #f5f7fa;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #e96900;
}

.markdown-body pre {
  padding: 16px;
  background-color: #f6f8fa;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-body pre code {
  padding: 0;
  background-color: transparent;
  color: inherit;
  font-size: 13px;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 24px;
  margin-bottom: 16px;
}

.markdown-body li {
  margin-bottom: 4px;
}

.markdown-body blockquote {
  padding: 0 16px;
  border-left: 4px solid #dfe2e5;
  color: #606266;
  margin-bottom: 16px;
}

.markdown-body a {
  color: #409eff;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body strong {
  font-weight: 600;
}

.markdown-body em {
  font-style: italic;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.markdown-body table th,
.markdown-body table td {
  padding: 8px 12px;
  border: 1px solid #dfe2e5;
}

.markdown-body table th {
  background-color: #f5f7fa;
  font-weight: 600;
}

/* 滚动条样式 */
.editor-textarea::-webkit-scrollbar,
.preview-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.editor-textarea::-webkit-scrollbar-track,
.preview-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.editor-textarea::-webkit-scrollbar-thumb,
.preview-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.editor-textarea::-webkit-scrollbar-thumb:hover,
.preview-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .editor-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>

