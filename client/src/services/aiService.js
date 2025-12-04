import axios from './axios'

// AI 服务专用超时时间（60秒）
const AI_TIMEOUT = 30000

// 创建会话
export const createConversation = async (payload) => {
  return await axios.post('/ai/conversation', payload, {
    timeout: AI_TIMEOUT
  })
}

// 获取会话列表
export const getConversations = async (params = {}) => {
  return await axios.get('/ai/conversation', { params })
}

// 获取指定会话的消息历史
export const getMessages = async (conversationId, params = {}) => {
  return await axios.get(`/ai/conversation/${conversationId}`, { params })
}

// 发送消息并获取AI回复
export const sendMessage = async (conversationId, payload) => {
  return await axios.post(`/ai/conversation/${conversationId}`, payload, {
    timeout: AI_TIMEOUT
  })
}

// 删除会话
export const deleteConversation = async (conversationId) => {
  return await axios.delete(`/ai/conversation/${conversationId}`)
}

