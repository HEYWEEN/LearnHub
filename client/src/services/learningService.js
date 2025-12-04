import axios from './axios'

// 获取课程章节列表
export const getCourseChapters = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}/chapters`)
  return response.data // 返回章节数据
}

// 获取视频进度
export const getVideoProgress = async (courseId, chapterId) => {
  const response = await axios.get(`/learning/progress/${courseId}/${chapterId}/time`)
  return response.data // 返回进度数据
}

// 保存视频进度
export const saveVideoProgress = async (courseId, chapterId, progressData) => {
  const response = await axios.post(`/learning/progress/${courseId}/${chapterId}/time`, progressData)
  return response // 返回完整响应
}

// 获取章节笔记
export const getChapterNotes = async (courseId, chapterId) => {
  const response = await axios.get(`/learning/notes/${courseId}/${chapterId}`)
  return response.data // 返回笔记数据
}

// 保存章节笔记
export const saveChapterNotes = async (courseId, chapterId, content) => {
  const response = await axios.post(`/learning/notes/${courseId}/${chapterId}`, { content })
  return response // 返回完整响应
}

// 获取课程整体进度
export const getCourseProgress = async (courseId) => {
  const response = await axios.get(`/learning/progress/${courseId}`)
  return response.data // 返回进度数据
}

// 获取最近学习记录
export const getRecentLearning = async () => {
  const response = await axios.get('/learning/recent')
  return response.data // 返回学习记录数据
}
