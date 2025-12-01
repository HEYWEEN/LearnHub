import axios from './axios'
import * as mockService from './courseService.mock'

// 切换开关：true 使用 Mock，false 使用真实 API
const USE_MOCK = false

// 真实 API 调用
const realGetCourses = async (params) => {
  const response = await axios.get('/courses', { params })
  return response.data.data
}

const realGetCourseById = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}`)
  return response.data.data.course
}

const realEnrollCourse = async (courseId) => {
  const response = await axios.post(`/courses/${courseId}/enroll`)
  return response.data
}

const realCancelEnrollment = async (courseId) => {
  const response = await axios.post(`/courses/${courseId}/cancel`)
  return response.data
}

const realCheckEnrollmentStatus = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}/enrollment-status`)
  return response.data.data
}

const realSubmitReview = async (courseId, reviewData) => {
  const response = await axios.post(`/courses/${courseId}/reviews`, reviewData)
  return response.data
}

// 根据开关选择使用 Mock 或真实 API
export const getCourses = USE_MOCK ? mockService.getCourses : realGetCourses
export const getCourseById = USE_MOCK ? mockService.getCourseById : realGetCourseById
export const enrollCourse = USE_MOCK ? mockService.enrollCourse : realEnrollCourse
export const cancelEnrollment = USE_MOCK ? mockService.cancelEnrollment : realCancelEnrollment
export const checkEnrollmentStatus = USE_MOCK ? mockService.checkEnrollmentStatus : realCheckEnrollmentStatus
export const submitReview = USE_MOCK ? mockService.submitReview : realSubmitReview

