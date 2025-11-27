/**
 * Mock 教师服务 - 教师工作台相关功能
 */

// 模拟延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟学生报名数据
const mockEnrollments = [
  // 李明(user_002)的课程: course_2 (Vue3 + TypeScript实战开发) - 共3章
  {
    id: 'enrollment_001',
    courseId: 'course_2',
    course: {
      id: 'course_2',
      title: 'Vue3 + TypeScript实战开发'
    },
    student: {
      id: 'user_001',
      username: '张三',
      email: 'zhangsan@example.com',
      avatar: null
    },
    enrolledAt: '2024-02-15T10:00:00Z',
    progress: 67, // 2/3 = 66.67%
    completedChapters: 2,
    totalChapters: 3,
    notesCount: 3, // chapter_1, chapter_2, chapter_3各一条
    lastStudyTime: '2024-03-10T15:30:00Z'
  },
  {
    id: 'enrollment_002',
    courseId: 'course_2',
    course: {
      id: 'course_2',
      title: 'Vue3 + TypeScript实战开发'
    },
    student: {
      id: 'user_003',
      username: '王芳',
      email: 'wangfang@example.com',
      avatar: null
    },
    enrolledAt: '2024-02-20T09:00:00Z',
    progress: 33, // 1/3 = 33.33%
    completedChapters: 1,
    totalChapters: 3,
    notesCount: 2, // chapter_1, chapter_2各一条
    lastStudyTime: '2024-03-12T10:20:00Z'
  },
  {
    id: 'enrollment_003',
    courseId: 'course_2',
    course: {
      id: 'course_2',
      title: 'Vue3 + TypeScript实战开发'
    },
    student: {
      id: 'user_004',
      username: '刘洋',
      email: 'liuyang@example.com',
      avatar: null
    },
    enrolledAt: '2024-03-01T11:00:00Z',
    progress: 33, // 1/3 = 33.33%
    completedChapters: 1,
    totalChapters: 3,
    notesCount: 2, // chapter_1, chapter_2各一条
    lastStudyTime: '2024-03-13T14:00:00Z'
  },
  {
    id: 'enrollment_004',
    courseId: 'course_2',
    course: {
      id: 'course_2',
      title: 'Vue3 + TypeScript实战开发'
    },
    student: {
      id: 'user_005',
      username: '赵敏',
      email: 'zhaomin@example.com',
      avatar: null
    },
    enrolledAt: '2024-03-05T13:00:00Z',
    progress: 100, // 3/3 = 100%
    completedChapters: 3,
    totalChapters: 3,
    notesCount: 3, // 三章各一条笔记
    lastStudyTime: '2024-03-14T16:45:00Z'
  }
]

// 添加李明的第二门课程数据 course_12 (前端性能优化实战) - 共5章
const additionalEnrollments = [
  {
    id: 'enrollment_005',
    courseId: 'course_12',
    course: {
      id: 'course_12',
      title: '前端性能优化实战'
    },
    student: {
      id: 'user_003',
      username: '王芳',
      email: 'wangfang@example.com',
      avatar: null
    },
    enrolledAt: '2024-02-25T10:00:00Z',
    progress: 80, // 4/5 = 80%
    completedChapters: 4,
    totalChapters: 5,
    notesCount: 2, // chapter_1和chapter_3各一条
    lastStudyTime: '2024-03-11T11:30:00Z'
  },
  {
    id: 'enrollment_006',
    courseId: 'course_12',
    course: {
      id: 'course_12',
      title: '前端性能优化实战'
    },
    student: {
      id: 'user_006',
      username: '陈峰',
      email: 'chenfeng@example.com',
      avatar: null
    },
    enrolledAt: '2024-03-10T09:00:00Z',
    progress: 20, // 1/5 = 20%
    completedChapters: 1,
    totalChapters: 5,
    notesCount: 2, // chapter_1和chapter_2各一条
    lastStudyTime: '2024-03-15T09:20:00Z'
  }
]

// 合并所有报名数据
const allEnrollments = [...mockEnrollments, ...additionalEnrollments]

/**
 * 获取教师数据统计
 * @param {string} teacherId - 教师ID
 */
export const getTeacherStatistics = async (teacherId) => {
  await delay()
  
  // 获取教师的所有课程
  const teacherCourses = [
    {
      id: 'course_2',
      title: 'Vue3 + TypeScript实战开发',
      lessonCount: 3,
      instructor: { id: 'user_002' }
    },
    {
      id: 'course_12',
      title: '前端性能优化实战',
      lessonCount: 5,
      instructor: { id: 'user_002' }
    }
  ]
  
  // 计算课程数量
  const courseCount = teacherCourses.length
  
  // 获取所有报名的学生（去重）
  const courseIds = teacherCourses.map(c => c.id)
  const enrolledStudents = allEnrollments.filter(e => courseIds.includes(e.courseId))
  const uniqueStudentIds = new Set(enrolledStudents.map(e => e.student.id))
  const studentCount = uniqueStudentIds.size
  
  // 计算总课时数
  const totalLessons = teacherCourses.reduce((sum, course) => sum + course.lessonCount, 0)
  
  return {
    success: true,
    data: {
      courseCount,
      studentCount,
      totalLessons
    }
  }
}

/**
 * 获取报名学生列表及学习情况
 * @param {string} teacherId - 教师ID
 * @param {string} courseId - 可选，按课程筛选
 */
export const getEnrolledStudents = async (teacherId, courseId = null) => {
  await delay()
  
  // 获取教师的所有课程ID
  const teacherCourseIds = ['course_2', 'course_12']
  
  // 筛选报名数据
  let enrollments = allEnrollments.filter(e => teacherCourseIds.includes(e.courseId))
  
  // 如果指定了课程，进一步筛选
  if (courseId) {
    enrollments = enrollments.filter(e => e.courseId === courseId)
  }
  
  return {
    success: true,
    data: enrollments,
    total: enrollments.length
  }
}

/**
 * 获取学生详细学习数据
 * @param {string} studentId - 学生ID
 * @param {string} courseId - 课程ID
 */
export const getStudentDetailedProgress = async (studentId, courseId) => {
  await delay()
  
  const enrollment = allEnrollments.find(
    e => e.student.id === studentId && e.courseId === courseId
  )
  
  if (!enrollment) {
    throw new Error('未找到学生报名记录')
  }
  
  // 返回详细的学习数据
  return {
    success: true,
    data: {
      ...enrollment,
      chapterProgress: [
        { chapterId: 'chapter_1', title: '第1章', completed: true, watchTime: 1400, totalTime: 1400 },
        { chapterId: 'chapter_2', title: '第2章', completed: enrollment.completedChapters >= 2, watchTime: 1200, totalTime: 1600 },
        { chapterId: 'chapter_3', title: '第3章', completed: enrollment.completedChapters >= 3, watchTime: 500, totalTime: 2000 }
      ]
    }
  }
}

// 导出供其他模块使用
export { allEnrollments }

