// Mock 数据服务 - 课程模块

// 模拟课程数据
const mockCourses = [
  {
    id: 'course_1',
    title: 'React从入门到实战',
    description: '深入学习React核心概念，包括组件、状态管理、Hooks等，通过实战项目掌握现代前端开发技能',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_456',
      name: '王老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '前端开发',
    lessonCount: 24,
    enrollmentCount: 1580
  },
  {
    id: 'course_2',
    title: 'Vue3 + TypeScript实战开发',
    description: '全面掌握Vue3新特性和TypeScript类型系统，构建企业级应用',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_457',
      name: '李老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '前端开发',
    lessonCount: 32,
    enrollmentCount: 2340
  },
  {
    id: 'course_3',
    title: 'Node.js后端开发完整指南',
    description: '从零开始学习Node.js后端开发，掌握Express框架、数据库操作、RESTful API设计',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_458',
      name: '张老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '后端开发',
    lessonCount: 28,
    enrollmentCount: 1890
  },
  {
    id: 'course_4',
    title: 'Python数据分析与可视化',
    description: '使用Python进行数据分析，掌握Pandas、NumPy、Matplotlib等核心库',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_459',
      name: '赵老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '数据科学',
    lessonCount: 36,
    enrollmentCount: 3210
  },
  {
    id: 'course_5',
    title: '机器学习基础与实践',
    description: '系统学习机器学习算法原理，通过实战项目掌握模型训练和调优技巧',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_460',
      name: '孙老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '人工智能',
    lessonCount: 40,
    enrollmentCount: 2780
  },
  {
    id: 'course_6',
    title: 'Java Spring Boot微服务架构',
    description: '掌握Spring Boot框架，学习微服务架构设计和分布式系统开发',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_461',
      name: '周老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '后端开发',
    lessonCount: 45,
    enrollmentCount: 2150
  },
  {
    id: 'course_7',
    title: 'MySQL数据库设计与优化',
    description: '深入理解数据库原理，掌握SQL查询优化、索引设计、事务处理等核心技能',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_462',
      name: '吴老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '数据库',
    lessonCount: 30,
    enrollmentCount: 1670
  },
  {
    id: 'course_8',
    title: 'Docker容器化技术实战',
    description: '学习Docker容器技术，掌握镜像构建、容器编排、CI/CD集成',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_463',
      name: '郑老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: 'DevOps',
    lessonCount: 22,
    enrollmentCount: 1420
  },
  {
    id: 'course_9',
    title: 'Web安全与渗透测试',
    description: '了解常见Web安全漏洞，学习安全防护策略和渗透测试技术',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_464',
      name: '冯老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '网络安全',
    lessonCount: 26,
    enrollmentCount: 980
  },
  {
    id: 'course_10',
    title: 'Flutter跨平台移动开发',
    description: '使用Flutter框架开发iOS和Android应用，一套代码多端运行',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_465',
      name: '陈老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '移动开发',
    lessonCount: 35,
    enrollmentCount: 1760
  },
  {
    id: 'course_11',
    title: 'Go语言高并发编程',
    description: '掌握Go语言特性和并发编程模型，构建高性能后端服务',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_466',
      name: '黄老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '后端开发',
    lessonCount: 28,
    enrollmentCount: 1340
  },
  {
    id: 'course_12',
    title: '前端性能优化实战',
    description: '学习前端性能优化技巧，提升网页加载速度和用户体验',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_467',
      name: '杨老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: '前端开发',
    lessonCount: 18,
    enrollmentCount: 2100
  },
  {
    id: 'course_13',
    title: 'Kubernetes容器编排',
    description: '深入学习K8s集群管理、服务部署、自动扩缩容等企业级容器编排技术',
    coverImage: '/src/assets/images/default-course.png',
    instructor: {
      id: 'user_468',
      name: '刘老师',
      avatar: '/src/assets/images/default-teacher.jpg'
    },
    category: 'DevOps',
    lessonCount: 33,
    enrollmentCount: 890
  }
]

// 模拟延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 获取课程列表
export const getCourses = async (params = {}) => {
  await delay()
  
  const { page = 1, limit = 12, search = '', category = '' } = params
  
  // 搜索和筛选
  let filteredCourses = mockCourses
  
  if (search) {
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  if (category) {
    filteredCourses = filteredCourses.filter(course => course.category === category)
  }
  
  // 分页
  const total = filteredCourses.length
  const pages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const courses = filteredCourses.slice(startIndex, endIndex)
  
  return {
    courses,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages
    }
  }
}

// 获取课程详情
export const getCourseById = async (courseId) => {
  await delay()
  
  const course = mockCourses.find(c => c.id === courseId)
  
  if (!course) {
    throw new Error('课程不存在')
  }
  
<<<<<<< HEAD
  // 根据课程ID返回对应的章节（与学习模块保持一致）
  const chaptersMap = {
    'course_1': [
      {
        id: 'chapter_1',
        title: '第1章：React基础概念',
        duration: 1200,
        videoUrl: '/1.mp4',
        order: 1,
        description: '学习React核心概念'
      },
      {
        id: 'chapter_2',
        title: '第2章：组件与Props',
        duration: 1500,
        videoUrl: '/2.mp4',
        order: 2,
        description: '深入理解组件和Props'
      },
      {
        id: 'chapter_3',
        title: '第3章：State与生命周期',
        duration: 1800,
        videoUrl: '/3.mp4',
        order: 3,
        description: '掌握State管理和组件生命周期'
      }
    ],
    'course_2': [
      {
        id: 'chapter_1',
        title: '第1章：Vue3新特性介绍',
        duration: 1400,
        videoUrl: '/1.mp4',
        order: 1,
        description: 'Vue3核心特性详解'
      },
      {
        id: 'chapter_2',
        title: '第2章：Composition API详解',
        duration: 1600,
        videoUrl: '/2.mp4',
        order: 2,
        description: 'Composition API实战'
      },
      {
        id: 'chapter_3',
        title: '第3章：TypeScript集成',
        duration: 2000,
        videoUrl: '/3.mp4',
        order: 3,
        description: 'Vue3与TypeScript完美结合'
      }
    ],
    'course_3': [
      {
        id: 'chapter_1',
        title: '第1章：Node.js环境搭建',
        duration: 1000,
        videoUrl: '/1.mp4',
        order: 1,
        description: 'Node.js开发环境配置'
      },
      {
        id: 'chapter_2',
        title: '第2章：Express框架基础',
        duration: 1800,
        videoUrl: '/2.mp4',
        order: 2,
        description: 'Express框架入门与实践'
      },
      {
        id: 'chapter_3',
        title: '第3章：RESTful API设计',
        duration: 2200,
        videoUrl: '/3.mp4',
        order: 3,
        description: 'RESTful API设计最佳实践'
      }
    ]
  }
  
=======
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
  // 返回详细信息（后续扩展）
  return {
    ...course,
    videoPreview: '/previews/preview.mp4',
    instructor: {
      ...course.instructor,
      bio: '资深讲师，拥有10年以上教学经验，专注于技术教育和人才培养。曾在多家知名企业担任技术负责人，善于将复杂的技术概念讲解得通俗易懂。'
    },
<<<<<<< HEAD
    chapters: chaptersMap[courseId] || [],
=======
    lessons: [
      {
        id: 'lesson_1',
        title: '第一章：基础概念',
        duration: 1800,
        videoUrl: '/videos/lesson1.mp4',
        description: '学习核心概念'
      },
      {
        id: 'lesson_2',
        title: '第二章：进阶实战',
        duration: 2400,
        videoUrl: '/videos/lesson2.mp4',
        description: '实战项目开发'
      },
      {
        id: 'lesson_3',
        title: '第三章：实战案例分析',
        duration: 3000,
        videoUrl: '/videos/lesson3.mp4',
        description: '真实项目案例分析'
      }
    ],
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
    reviews: [
      {
        id: 'review_1',
        user: {
          name: '学生A',
          avatar: '/src/assets/images/default-avatar.png'
        },
        rating: 5,
        comment: '课程内容很棒，老师讲解清晰！',
        createdAt: '2024-01-10T14:30:00Z'
      },
      {
        id: 'review_2',
        user: {
          name: '张同学',
          avatar: '/src/assets/images/default-avatar.png'
        },
        rating: 5,
        comment: '非常实用的课程，学到了很多实战技巧，老师讲解非常详细。',
        createdAt: '2024-01-12T09:15:00Z'
      },
      {
        id: 'review_3',
        user: {
          name: '李明',
          avatar: '/src/assets/images/default-avatar.png'
        },
        rating: 4,
        comment: '课程质量很高，内容充实。建议增加更多练习题。',
        createdAt: '2024-01-15T16:20:00Z'
      }
    ]
  }
}

// 模拟用户已报名的课程（使用 Set 存储）
const enrolledCourses = new Set()

// 报名课程
export const enrollCourse = async (courseId) => {
  await delay()
  
  const course = mockCourses.find(c => c.id === courseId)
  
  if (!course) {
    throw new Error('课程不存在')
  }
  
  // 添加到已报名列表
  enrolledCourses.add(courseId)
  
  // 模拟报名成功
  return {
    success: true,
    message: '报名成功！',
    enrollment: {
      courseId,
      enrolledAt: new Date().toISOString()
    }
  }
}

// 取消报名
export const cancelEnrollment = async (courseId) => {
  await delay()
  
  const course = mockCourses.find(c => c.id === courseId)
  
  if (!course) {
    throw new Error('课程不存在')
  }
  
  // 从已报名列表中移除
  enrolledCourses.delete(courseId)
  
  return {
    success: true,
    message: '取消报名成功！'
  }
}

// 检查报名状态
export const checkEnrollmentStatus = async (courseId) => {
  await delay(100)
  
  return {
    isEnrolled: enrolledCourses.has(courseId)
  }
}

// 提交评论
export const submitReview = async (courseId, reviewData) => {
  await delay()
  
  const course = mockCourses.find(c => c.id === courseId)
  
  if (!course) {
    throw new Error('课程不存在')
  }
  
  // 模拟创建评论
  const newReview = {
    id: `review_${Date.now()}`,
    user: {
      name: '当前用户',
      avatar: '/src/assets/images/default-avatar.png'
    },
    rating: reviewData.rating,
    comment: reviewData.comment,
    createdAt: new Date().toISOString()
  }
  
  return {
    success: true,
    message: '评论发表成功！',
    review: newReview
  }
}

