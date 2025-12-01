import axios from './axios'
import * as mockService from './teacherService.mock'

// 切换开关：true 使用 Mock，false 使用真实 API
const USE_MOCK = true

// 真实 API 调用
const realGetTeacherStatistics = async (teacherId) => {
  const response = await axios.get(`/teacher/${teacherId}/statistics`)
  return response.data
}

const realGetEnrolledStudents = async (teacherId, courseId = null) => {
  const params = courseId ? { courseId } : {}
  const response = await axios.get(`/teacher/${teacherId}/students`, { params })
  return response.data
}

const realGetStudentDetailedProgress = async (studentId, courseId) => {
  const response = await axios.get(`/teacher/students/${studentId}/progress`, {
    params: { courseId }
  })
  return response.data
}

const realGetTeacherCourses = async (teacherId) => {
  const response = await axios.get(`/teacher/${teacherId}/courses`)
  return response.data
}

const realCreateCourse = async (courseData) => {
  const response = await axios.post('/teacher/courses', courseData)
  return response.data
}

const realUpdateCourse = async (courseId, courseData) => {
  const response = await axios.put(`/teacher/courses/${courseId}`, courseData)
  return response.data
}

const realDeleteCourse = async (courseId) => {
  const response = await axios.delete(`/teacher/courses/${courseId}`)
  return response.data
}

// 根据开关选择使用 Mock 或真实 API
export const getTeacherStatistics = USE_MOCK ? mockService.getTeacherStatistics : realGetTeacherStatistics
export const getEnrolledStudents = USE_MOCK ? mockService.getEnrolledStudents : realGetEnrolledStudents
export const getStudentDetailedProgress = USE_MOCK ? mockService.getStudentDetailedProgress : realGetStudentDetailedProgress

export { getTeacherCourses, createCourse, updateCourse, deleteCourse } from './courseService.mock'

