import axios from './axios'

// 获取课程章节列表 (使用lesson接口)
export const getCourseChapters = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}/lesson`)
  return response // 返回完整响应
}

// 获取视频进度
export const getVideoProgress = async (courseId, lessonId) => {
  const response = await axios.get(`/learning/progress/${courseId}/${lessonId}/time`)
  return response // 返回完整响应
}

// 保存视频进度
export const saveVideoProgress = async (courseId, lessonId, progressData) => {
  const response = await axios.post(`/learning/progress/${courseId}/${lessonId}/time`, progressData)
  return response // 返回完整响应
}

// 获取章节笔记
export const getChapterNotes = async (courseId, lessonId) => {
  const response = await axios.get(`/notes/${courseId}/${lessonId}`)
  return response // 返回完整响应
}

// 保存章节笔记
export const saveChapterNotes = async (courseId, lessonId, content) => {
  const response = await axios.post(`/notes/${courseId}/${lessonId}`, { content })
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
