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
export const getTeacherCourses = async (params = {}) => {
  const response = await axios.get(`/teacher/courses`, { params })
  return response // 返回完整响应 { success, message, data }
}

// 创建课程
export const createCourse = async (courseData) => {
  // 转换前端字段名到后端字段名
  const payload = {
    title: courseData.title,
    description: courseData.description,
    category: courseData.category,
    cover_image: courseData.coverImage || courseData.cover_image || null,
    video_preview: courseData.videoPreview || courseData.video_preview || null
  }
  const response = await axios.post('/courses', payload)
  return response.data // 返回创建的课程数据
}

// 更新课程
export const updateCourse = async (courseId, courseData) => {
  // 转换前端字段名到后端字段名
  const payload = {
    title: courseData.title,
    description: courseData.description,
    category: courseData.category,
    cover_image: courseData.coverImage || courseData.cover_image || null,
    video_preview: courseData.videoPreview || courseData.video_preview || null
  }
  const response = await axios.post(`/courses/${courseId}`, payload)
  return response.data // 返回更新后的课程数据
}

// 删除课程
export const deleteCourse = async (courseId) => {
  const response = await axios.delete(`/courses/${courseId}`)
  return response // 返回完整响应
}

// 上传课程封面
export const uploadCoverImage = async (courseId, file) => {
  const formData = new FormData()
  formData.append('image', file)
  const response = await axios.post(`/courses/${courseId}/cover-img`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

// 获取课程章节列表
export const getLessons = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}/lesson`)
  return response.data // 返回章节列表
}

// 添加章节
export const addLesson = async (courseId, lessonData) => {
  const payload = {
    title: lessonData.title,
    description: lessonData.description || null,
    video_url: lessonData.videoUrl || null,
    duration: lessonData.duration || null
  }
  const response = await axios.post(`/courses/${courseId}/lesson`, payload)
  return response // 返回完整响应 { success, message, data }
}

// 更新章节信息
export const updateLesson = async (courseId, lessonId, lessonData) => {
  const payload = {
    title: lessonData.title,
    description: lessonData.description || null
  }
  const response = await axios.post(`/courses/${courseId}/lesson/${lessonId}`, payload)
  return response // 返回完整响应 { success, message, data }
}

// 删除章节
export const deleteLesson = async (courseId, lessonId) => {
  const response = await axios.delete(`/courses/${courseId}/lesson/${lessonId}`)
  return response // 返回完整响应 { success, message, data }
}

// 上传/更换章节视频
export const uploadLessonVideo = async (courseId, lessonId, videoFile, onUploadProgress) => {
  const formData = new FormData()
  formData.append('video', videoFile)
  
  const response = await axios.post(
    `/courses/${courseId}/lesson/${lessonId}/video`, 
    formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onUploadProgress // 支持上传进度回调
    }
  )
  return response // 返回完整响应 { success, message, data }
}