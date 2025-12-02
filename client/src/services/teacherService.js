import axios from './axios'

// 获取教师统计数据
export const getTeacherStatistics = async (teacherId) => {
  const response = await axios.get(`/teacher/${teacherId}/statistics`)
  return response.data // 返回统计数据
}

// 获取已选课学生列表
export const getEnrolledStudents = async (teacherId, courseId = null) => {
  const params = courseId ? { courseId } : {}
  const response = await axios.get(`/teacher/${teacherId}/students`, { params })
  return response.data // 返回学生列表数据
}

// 获取学生详细进度
export const getStudentDetailedProgress = async (studentId, courseId) => {
  const response = await axios.get(`/teacher/students/${studentId}/progress`, {
    params: { courseId }
  })
  return response.data // 返回进度数据
}

// 导出课程相关功能（从 courseService 导出）
export { 
  getTeacherCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from './courseService'
