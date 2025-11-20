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
  ]
}

// 模拟视频进度数据存储
const mockProgress = {}

// 模拟笔记数据存储
const mockNotes = {}

// 模拟已完成章节数据
const mockCompletedChapters = {}

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

