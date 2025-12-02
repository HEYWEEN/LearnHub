import axios from './axios'

// 获取课程列表
export const getCourses = async (params) => {
  // axios拦截器返回 res.data，即 { success, message, data, code }
  // 我们需要返回 data 字段中的内容
  const response = await axios.get('/courses', { params })
  return response.data // 返回 { courses: [...], pagination: {...} }
}

// 根据ID获取课程详情
export const getCourseById = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}`)
  return response.data // 返回课程对象
}

// 选课
export const enrollCourse = async (courseId) => {
  const response = await axios.post(`/courses/${courseId}/enroll`)
  return response // 返回完整响应 { success, message, data }
}

// 退课
export const cancelEnrollment = async (courseId) => {
  const response = await axios.post(`/courses/${courseId}/cancel`)
  return response // 返回完整响应 { success, message, data }
}

// 检查选课状态
export const checkEnrollmentStatus = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}/enrollment-status`)
  return response.data // 返回状态数据
}

// 提交课程评价
export const submitReview = async (courseId, reviewData) => {
  const response = await axios.post(`/courses/${courseId}/reviews`, reviewData)
  return response // 返回完整响应
}

// 获取教师课程列表
export const getTeacherCourses = async (teacherId) => {
  const response = await axios.get(`/teacher/${teacherId}/courses`)
  return response.data // 返回课程列表数据
}

// 创建课程
export const createCourse = async (courseData) => {
  const response = await axios.post('/teacher/courses', courseData)
  return response.data // 返回创建的课程数据
}

// 更新课程
export const updateCourse = async (courseId, courseData) => {
  const response = await axios.put(`/teacher/courses/${courseId}`, courseData)
  return response.data // 返回更新后的课程数据
}

// 删除课程
export const deleteCourse = async (courseId) => {
  const response = await axios.delete(`/teacher/courses/${courseId}`)
  return response // 返回完整响应
}
