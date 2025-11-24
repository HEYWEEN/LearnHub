// Mock 数据服务 - 学习模块

// 模拟课程章节数据
const mockChapters = {
  course_1: [
    {
      id: 'chapter_1',
      title: '第1章：React基础概念',
      videoUrl: '/1.mp4',
      duration: 1200, // 20分钟
      order: 1
    },
    {
      id: 'chapter_2',
      title: '第2章：组件与Props',
      videoUrl: '/2.mp4',
      duration: 1500, // 25分钟
      order: 2
    },
    {
      id: 'chapter_3',
      title: '第3章：State与生命周期',
      videoUrl: '/3.mp4',
      duration: 1800, // 30分钟
      order: 3
    }
  ],
  course_2: [
    {
      id: 'chapter_1',
      title: '第1章：Vue3新特性介绍',
      videoUrl: '/1.mp4',
      duration: 1400,
      order: 1
    },
    {
      id: 'chapter_2',
      title: '第2章：Composition API详解',
      videoUrl: '/2.mp4',
      duration: 1600,
      order: 2
    },
    {
      id: 'chapter_3',
      title: '第3章：TypeScript集成',
      videoUrl: '/3.mp4',
      duration: 2000,
      order: 3
    }
  ],
  course_3: [
    {
      id: 'chapter_1',
      title: '第1章：Node.js环境搭建',
      videoUrl: '/1.mp4',
      duration: 1000,
      order: 1
    },
    {
      id: 'chapter_2',
      title: '第2章：Express框架基础',
      videoUrl: '/2.mp4',
      duration: 1800,
      order: 2
    },
    {
      id: 'chapter_3',
      title: '第3章：RESTful API设计',
      videoUrl: '/3.mp4',
      duration: 2200,
      order: 3
    }
  ],
  course_12: [
    {
      id: 'chapter_1',
      title: '第1章：性能优化基础',
      videoUrl: '/1.mp4',
      duration: 1200,
      order: 1
    },
    {
      id: 'chapter_2',
      title: '第2章：资源加载优化',
      videoUrl: '/2.mp4',
      duration: 1500,
      order: 2
    },
    {
      id: 'chapter_3',
      title: '第3章：渲染性能优化',
      videoUrl: '/3.mp4',
      duration: 1800,
      order: 3
    },
    {
      id: 'chapter_4',
      title: '第4章：网络请求优化',
      videoUrl: '/4.mp4',
      duration: 1600,
      order: 4
    },
    {
      id: 'chapter_5',
      title: '第5章：代码分割与懒加载',
      videoUrl: '/5.mp4',
      duration: 1700,
      order: 5
    }
  ]
}

// 模拟视频进度数据存储
const mockProgress = {
  // 张三(user_001) 在 course_2 的学习进度
  'course_2_chapter_1': { currentTime: 1400, completed: true, lastUpdated: '2024-03-10T15:30:00Z' },
  'course_2_chapter_2': { currentTime: 1200, completed: true, lastUpdated: '2024-03-10T15:30:00Z' },
  'course_2_chapter_3': { currentTime: 500, completed: false, lastUpdated: '2024-03-10T15:30:00Z' },
  
  // 王芳(user_003) 在 course_2 的学习进度
  'user_003_course_2_chapter_1': { currentTime: 1400, completed: true, lastUpdated: '2024-03-12T10:20:00Z' },
  'user_003_course_2_chapter_2': { currentTime: 800, completed: false, lastUpdated: '2024-03-12T10:20:00Z' },
  
  // 王芳(user_003) 在 course_12 的学习进度
  'user_003_course_12_chapter_1': { currentTime: 1200, completed: true, lastUpdated: '2024-03-11T11:30:00Z' },
  'user_003_course_12_chapter_2': { currentTime: 1500, completed: true, lastUpdated: '2024-03-11T11:30:00Z' },
  'user_003_course_12_chapter_3': { currentTime: 1800, completed: true, lastUpdated: '2024-03-11T11:30:00Z' },
  'user_003_course_12_chapter_4': { currentTime: 1600, completed: true, lastUpdated: '2024-03-11T11:30:00Z' },
  'user_003_course_12_chapter_5': { currentTime: 850, completed: false, lastUpdated: '2024-03-11T11:30:00Z' },
  
  // 刘洋(user_004) 在 course_2 的学习进度
  'user_004_course_2_chapter_1': { currentTime: 1400, completed: true, lastUpdated: '2024-03-13T14:00:00Z' },
  'user_004_course_2_chapter_2': { currentTime: 400, completed: false, lastUpdated: '2024-03-13T14:00:00Z' },
  
  // 赵敏(user_005) 在 course_2 的学习进度 (100%完成)
  'user_005_course_2_chapter_1': { currentTime: 1400, completed: true, lastUpdated: '2024-03-14T16:45:00Z' },
  'user_005_course_2_chapter_2': { currentTime: 1600, completed: true, lastUpdated: '2024-03-14T16:45:00Z' },
  'user_005_course_2_chapter_3': { currentTime: 2000, completed: true, lastUpdated: '2024-03-14T16:45:00Z' },
  
  // 陈峰(user_006) 在 course_12 的学习进度
  'user_006_course_12_chapter_1': { currentTime: 1200, completed: true, lastUpdated: '2024-03-15T09:20:00Z' },
  'user_006_course_12_chapter_2': { currentTime: 750, completed: false, lastUpdated: '2024-03-15T09:20:00Z' }
}

// 模拟笔记数据存储
const mockNotes = {
  // 张三的笔记
  'user_001_course_2_chapter_1': { content: 'Vue3的响应式系统非常强大', updatedAt: '2024-03-10T15:30:00Z' },
  'user_001_course_2_chapter_2': { content: 'Composition API让代码组织更清晰', updatedAt: '2024-03-10T15:30:00Z' },
  'user_001_course_2_chapter_3': { content: 'TypeScript的类型检查很有用', updatedAt: '2024-03-10T15:30:00Z' },
  
  // 王芳的笔记
  'user_003_course_2_chapter_1': { content: '学习了Vue3的基础知识', updatedAt: '2024-03-12T10:20:00Z' },
  'user_003_course_2_chapter_2': { content: 'setup函数的使用方法', updatedAt: '2024-03-12T10:20:00Z' },
  'user_003_course_12_chapter_1': { content: '性能优化的重要性', updatedAt: '2024-03-11T11:30:00Z' },
  'user_003_course_12_chapter_3': { content: '减少重排和重绘', updatedAt: '2024-03-11T11:30:00Z' },
  
  // 刘洋的笔记
  'user_004_course_2_chapter_1': { content: 'Vue3的新特性很实用', updatedAt: '2024-03-13T14:00:00Z' },
  'user_004_course_2_chapter_2': { content: '响应式原理学习笔记', updatedAt: '2024-03-13T14:00:00Z' },
  
  // 赵敏的笔记
  'user_005_course_2_chapter_1': { content: 'Vue3新特性总结', updatedAt: '2024-03-14T16:45:00Z' },
  'user_005_course_2_chapter_2': { content: 'Composition API详细笔记', updatedAt: '2024-03-14T16:45:00Z' },
  'user_005_course_2_chapter_3': { content: 'TypeScript集成实践', updatedAt: '2024-03-14T16:45:00Z' },
  
  // 陈峰的笔记
  'user_006_course_12_chapter_1': { content: '前端性能优化基础', updatedAt: '2024-03-15T09:20:00Z' },
  'user_006_course_12_chapter_2': { content: '资源压缩和缓存', updatedAt: '2024-03-15T09:20:00Z' }
}

// 模拟已完成章节数据
const mockCompletedChapters = {
  // 张三在course_2完成了2章
  'user_001_course_2': ['chapter_1', 'chapter_2'],
  // 王芳在course_2完成了1章
  'user_003_course_2': ['chapter_1'],
  // 王芳在course_12完成了4章
  'user_003_course_12': ['chapter_1', 'chapter_2', 'chapter_3', 'chapter_4'],
  // 刘洋在course_2完成了1章
  'user_004_course_2': ['chapter_1'],
  // 赵敏在course_2完成了全部3章
  'user_005_course_2': ['chapter_1', 'chapter_2', 'chapter_3'],
  // 陈峰在course_12完成了1章
  'user_006_course_12': ['chapter_1']
}

// 模拟最近学习记录
let recentLearning = null

/**
 * 获取课程章节列表
 */
export const getCourseChapters = async (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const chapters = mockChapters[courseId] || []
      resolve({
        success: true,
        data: {
          courseId,
          chapters
        },
        code: 200
      })
    }, 300)
  })
}

/**
 * 获取章节视频进度
 */
export const getVideoProgress = async (courseId, chapterId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `${courseId}_${chapterId}`
      const progress = mockProgress[key] || {
        currentTime: 0,
        completed: false,
        lastUpdated: null
      }
      resolve({
        success: true,
        data: progress,
        code: 200
      })
    }, 200)
  })
}

/**
 * 保存章节视频进度
 */
export const saveVideoProgress = async (courseId, chapterId, progressData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `${courseId}_${chapterId}`
      mockProgress[key] = {
        currentTime: progressData.currentTime,
        completed: progressData.completed || false,
        lastUpdated: new Date().toISOString()
      }
      
      // 如果标记为完成，添加到已完成列表
      if (progressData.completed) {
        if (!mockCompletedChapters[courseId]) {
          mockCompletedChapters[courseId] = []
        }
        if (!mockCompletedChapters[courseId].includes(chapterId)) {
          mockCompletedChapters[courseId].push(chapterId)
        }
      }
      
      // 更新最近学习记录
      recentLearning = {
        courseId,
        chapterId,
        lastUpdated: new Date().toISOString()
      }
      
      resolve({
        success: true,
        message: '进度保存成功',
        data: mockProgress[key],
        code: 200
      })
    }, 200)
  })
}

/**
 * 获取章节笔记
 */
export const getChapterNotes = async (courseId, chapterId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `${courseId}_${chapterId}`
      const notes = mockNotes[key] || {
        content: '',
        updatedAt: null
      }
      resolve({
        success: true,
        data: notes,
        code: 200
      })
    }, 200)
  })
}

/**
 * 保存章节笔记
 */
export const saveChapterNotes = async (courseId, chapterId, content) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `${courseId}_${chapterId}`
      mockNotes[key] = {
        content,
        updatedAt: new Date().toISOString()
      }
      resolve({
        success: true,
        message: '笔记保存成功',
        data: mockNotes[key],
        code: 200
      })
    }, 300)
  })
}

/**
 * 获取课程学习进度概览
 */
export const getCourseProgress = async (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const completedChapters = mockCompletedChapters[courseId] || []
      const totalChapters = (mockChapters[courseId] || []).length
      const progressPercentage = totalChapters > 0 
        ? Math.round((completedChapters.length / totalChapters) * 100)
        : 0
      
      resolve({
        success: true,
        data: {
          courseId,
          completedChapters,
          totalChapters,
          progressPercentage
        },
        code: 200
      })
    }, 200)
  })
}

/**
 * 获取最近学习记录
 */
export const getRecentLearning = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: recentLearning,
        code: 200
      })
    }, 200)
  })
}

