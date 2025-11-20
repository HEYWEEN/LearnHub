import axios from './axios'
import * as mockService from './learningService.mock'

// 切换开关：true 使用 Mock，false 使用真实 API
const USE_MOCK = true

// 真实 API 调用
const realGetCourseChapters = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}/chapters`)
  return response.data
}

const realGetVideoProgress = async (courseId, chapterId) => {
  const response = await axios.get(`/learning/progress/${courseId}/${chapterId}`)
  return response.data
}

const realSaveVideoProgress = async (courseId, chapterId, progressData) => {
  const response = await axios.post(`/learning/progress/${courseId}/${chapterId}`, progressData)
  return response.data
}

const realGetChapterNotes = async (courseId, chapterId) => {
  const response = await axios.get(`/learning/notes/${courseId}/${chapterId}`)
  return response.data
}

const realSaveChapterNotes = async (courseId, chapterId, content) => {
  const response = await axios.post(`/learning/notes/${courseId}/${chapterId}`, { content })
  return response.data
}

const realGetCourseProgress = async (courseId) => {
  const response = await axios.get(`/learning/progress/${courseId}`)
  return response.data
}

const realGetRecentLearning = async () => {
  const response = await axios.get('/learning/recent')
  return response.data
}

// 根据开关选择使用 Mock 或真实 API
export const getCourseChapters = USE_MOCK ? mockService.getCourseChapters : realGetCourseChapters
export const getVideoProgress = USE_MOCK ? mockService.getVideoProgress : realGetVideoProgress
export const saveVideoProgress = USE_MOCK ? mockService.saveVideoProgress : realSaveVideoProgress
export const getChapterNotes = USE_MOCK ? mockService.getChapterNotes : realGetChapterNotes
export const saveChapterNotes = USE_MOCK ? mockService.saveChapterNotes : realSaveChapterNotes
export const getCourseProgress = USE_MOCK ? mockService.getCourseProgress : realGetCourseProgress
export const getRecentLearning = USE_MOCK ? mockService.getRecentLearning : realGetRecentLearning

