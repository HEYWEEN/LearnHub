<template>
  <el-dialog
    v-model="visible"
    title="AI 学习助手"
    width="90%"
    :before-close="handleClose"
    class="ai-assistant-dialog"
    top="5vh"
  >
    <div class="ai-assistant-container">
      <!-- 左侧：会话列表 -->
      <div class="conversations-panel">
        <div class="panel-header">
          <h3>我的会话</h3>
          <el-button 
            type="primary" 
            size="small" 
            @click="handleCreateConversation"
            :loading="createLoading"
          >
            新建会话
          </el-button>
        </div>
        
        <div class="conversations-list">
          <div 
            v-if="conversationsLoading" 
            class="loading-container"
          >
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>加载中...</span>
          </div>
          
          <div 
            v-else-if="conversations.length === 0" 
            class="empty-state"
          >
            <el-icon :size="40"><ChatDotRound /></el-icon>
            <p>暂无会话</p>
            <p class="hint">点击"新建会话"开始对话</p>
          </div>
          
          <div 
            v-else
            v-for="conv in conversations" 
            :key="conv.id"
            class="conversation-item"
            :class="{ active: currentConversationId === conv.id }"
            @click="handleSelectConversation(conv.id)"
          >
            <div class="conv-info">
              <div class="conv-title">{{ conv.title || '未命名会话' }}</div>
              <div class="conv-time">{{ formatTime(conv.created_at) }}</div>
            </div>
            <el-button
              type="danger"
              size="small"
              text
              @click.stop="handleDeleteConversation(conv.id)"
              :loading="deletingConvId === conv.id"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧：聊天区域 -->
      <div class="chat-panel">
        <div v-if="!currentConversationId" class="empty-chat">
          <el-icon :size="80" color="#909399"><ChatDotRound /></el-icon>
          <p>请选择或创建一个会话开始对话</p>
        </div>
        
        <template v-else>
          <!-- 消息列表 -->
          <div class="messages-container" ref="messagesContainer">
            <div 
              v-if="messagesLoading" 
              class="loading-container"
            >
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>加载消息中...</span>
            </div>
            
            <div 
              v-else-if="messages.length === 0" 
              class="empty-messages"
            >
              <p>开始你的第一条消息吧！</p>
            </div>
            
            <div 
              v-else
              v-for="msg in messages" 
              :key="msg.id"
              class="message-item"
              :class="msg.sender"
            >
              <div class="message-bubble">
                <div class="message-content">{{ msg.context }}</div>
                <div class="message-time">{{ formatMessageTime(msg.send_at) }}</div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="input-container">
            <el-input
              v-model="messageText"
              type="textarea"
              :rows="3"
              placeholder="输入你的问题..."
              :disabled="sendLoading"
              @keydown.enter.ctrl="handleSendMessage"
            />
            <div class="input-actions">
              <span class="hint-text">Ctrl + Enter 发送</span>
              <el-button 
                type="primary" 
                @click="handleSendMessage"
                :loading="sendLoading"
                :disabled="!messageText.trim()"
              >
                发送
              </el-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading, ChatDotRound } from '@element-plus/icons-vue'
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  deleteConversation
} from '../../services/aiService'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 弹窗显示状态
const visible = ref(props.modelValue)

// 会话相关状态
const conversations = ref([])
const conversationsLoading = ref(false)
const currentConversationId = ref(null)
const createLoading = ref(false)
const deletingConvId = ref(null)

// 消息相关状态
const messages = ref([])
const messagesLoading = ref(false)
const messageText = ref('')
const sendLoading = ref(false)
const messagesContainer = ref(null)

// 监听弹窗显示状态
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    loadConversations()
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 加载会话列表
const loadConversations = async () => {
  conversationsLoading.value = true
  try {
    const result = await getConversations({ page: 1, limit: 50 })
    if (result.success) {
      conversations.value = result.data.conversations || []
    }
  } catch (error) {
    console.error('加载会话列表失败:', error)
    ElMessage.error('加载会话列表失败')
  } finally {
    conversationsLoading.value = false
  }
}

// 创建新会话
const handleCreateConversation = async () => {
  createLoading.value = true
  try {
    const result = await createConversation({
      title: `会话 ${new Date().toLocaleString()}`
    })
    if (result.success) {
      ElMessage.success('创建会话成功')
      await loadConversations()
      // 自动选中新创建的会话
      if (result.data.conversation) {
        handleSelectConversation(result.data.conversation.id)
      }
    }
  } catch (error) {
    console.error('创建会话失败:', error)
    ElMessage.error(error.response?.data?.message || '创建会话失败')
  } finally {
    createLoading.value = false
  }
}

// 选择会话
const handleSelectConversation = async (conversationId) => {
  currentConversationId.value = conversationId
  await loadMessages(conversationId)
}

// 加载消息历史
const loadMessages = async (conversationId) => {
  messagesLoading.value = true
  messages.value = []
  try {
    const result = await getMessages(conversationId, { page: 1, limit: 100 })
    if (result.success) {
      messages.value = result.data.message.messages || []
      // 滚动到底部
      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('加载消息失败:', error)
    ElMessage.error('加载消息失败')
  } finally {
    messagesLoading.value = false
  }
}

// 发送消息
const handleSendMessage = async () => {
  if (!messageText.value.trim()) {
    return
  }
  
  if (!currentConversationId.value) {
    ElMessage.warning('请先选择一个会话')
    return
  }

  const text = messageText.value.trim()
  sendLoading.value = true
  
  // 先显示用户消息
  messages.value.push({
    id: Date.now(),
    conversation_id: currentConversationId.value,
    sender: 'user',
    context: text,
    send_at: new Date().toISOString()
  })
  
  messageText.value = ''
  await nextTick()
  scrollToBottom()

  try {
    const result = await sendMessage(currentConversationId.value, { text })
    if (result.success) {
      // 添加AI回复
      messages.value.push({
        id: Date.now() + 1,
        conversation_id: currentConversationId.value,
        sender: 'assistant',
        context: result.data.message.answer,
        send_at: new Date().toISOString()
      })
      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error(error.response?.data?.message || '发送消息失败')
    // 移除用户消息
    messages.value.pop()
  } finally {
    sendLoading.value = false
  }
}

// 删除会话
const handleDeleteConversation = async (conversationId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个会话吗？删除后无法恢复。', '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    deletingConvId.value = conversationId
    try {
      const result = await deleteConversation(conversationId)
      if (result.success) {
        ElMessage.success('删除成功')
        // 如果删除的是当前会话，清空右侧
        if (currentConversationId.value === conversationId) {
          currentConversationId.value = null
          messages.value = []
        }
        // 重新加载会话列表
        await loadConversations()
      }
    } catch (error) {
      console.error('删除会话失败:', error)
      ElMessage.error(error.response?.data?.message || '删除会话失败')
    } finally {
      deletingConvId.value = null
    }
  } catch {
    // 用户取消删除
  }
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 格式化时间（会话列表）
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  
  // 一天内显示时间
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  // 一年内显示月日
  if (now.getFullYear() === date.getFullYear()) {
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  }
  // 否则显示年月日
  return date.toLocaleDateString('zh-CN')
}

// 格式化消息时间
const formatMessageTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
.ai-assistant-dialog :deep(.el-dialog__body) {
  padding: 0;
  height: 80vh;
}

.ai-assistant-container {
  display: flex;
  height: 80vh;
  background: #f5f7fa;
}

/* 左侧会话列表 */
.conversations-panel {
  width: 280px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.conversation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f5f7fa;
}

.conversation-item:hover {
  background: #e8eaf0;
}

.conversation-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-time {
  font-size: 12px;
  opacity: 0.7;
}

.conversation-item.active .conv-time {
  color: rgba(255, 255, 255, 0.9);
}

/* 右侧聊天区域 */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.empty-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.empty-chat p {
  margin-top: 16px;
  font-size: 14px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #909399;
  gap: 12px;
}

.empty-state,
.empty-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #909399;
  text-align: center;
}

.empty-state .hint {
  font-size: 12px;
  margin-top: 8px;
  opacity: 0.7;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  animation: messageSlide 0.3s ease-out;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item.user {
  justify-content: flex-end;
}

.message-item.assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
}

.message-item.user .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-item.assistant .message-bubble {
  background: white;
  color: #303133;
  border: 1px solid #e4e7ed;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-time {
  font-size: 11px;
  margin-top: 6px;
  opacity: 0.7;
}

/* 输入区域 */
.input-container {
  padding: 16px;
  background: white;
  border-top: 1px solid #e4e7ed;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.hint-text {
  font-size: 12px;
  color: #909399;
}

/* 滚动条样式 */
.conversations-list::-webkit-scrollbar,
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-thumb,
.messages-container::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.conversations-list::-webkit-scrollbar-thumb:hover,
.messages-container::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>

