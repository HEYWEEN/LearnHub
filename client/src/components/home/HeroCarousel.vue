<template>
  <div class="carousel-container">
    <div 
      class="carousel"
      @mouseenter="pauseAutoPlay"
      @mouseleave="resumeAutoPlay"
    >
      <!-- 轮播图片 -->
      <div 
        v-for="(image, index) in images" 
        :key="index"
        class="carousel-item"
        :class="{ active: currentIndex === index }"
      >
        <img :src="image.src" :alt="image.alt" />
        <div class="carousel-overlay">
          <div class="carousel-text">
            <h2>{{ image.title }}</h2>
            <p>{{ image.description }}</p>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <button class="carousel-button prev" @click="prevSlide">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>
      </button>
      <button class="carousel-button next" @click="nextSlide">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>
      </button>

      <!-- 指示器 -->
      <div class="carousel-indicators">
        <span 
          v-for="(image, index) in images" 
          :key="`indicator-${index}`"
          class="indicator"
          :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Img1 from '../../assets/images/大礼堂.jpeg'
import Img2 from '../../assets/images/北大楼.jpg'

// 轮播图片数据
const images = [
  {
    src: Img1,
    alt: '大礼堂',
    title: '玉兰栖黛瓦，春香浸古檐',
    description: '把春日的柔婉缀满百年建筑的檐角'
  },
  {
    src: Img2,
    alt: '北大楼',
    title: '藤蔓裹旧檐，新厦接云巅',
    description: '用青藤织就时光交错'
  }
]

const currentIndex = ref(0)
let autoPlayTimer = null
const isPaused = ref(false)

// 下一张
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

// 上一张
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

// 跳转到指定幻灯片
const goToSlide = (index) => {
  currentIndex.value = index
  resetAutoPlay()
}

// 自动播放
const startAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
  if (!isPaused.value) {
    autoPlayTimer = setInterval(() => {
      nextSlide()
    }, 5000) // 每5秒切换一次
  }
}

// 重置自动播放
const resetAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
  startAutoPlay()
}

// 暂停自动播放
const pauseAutoPlay = () => {
  isPaused.value = true
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 恢复自动播放
const resumeAutoPlay = () => {
  isPaused.value = false
  startAutoPlay()
}

// 生命周期
onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
})
</script>

<style scoped>
.carousel-container {
  width: 100%;
  overflow: hidden;
}

.carousel {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

/* 轮播切换动画 */
.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.carousel-item.active {
  opacity: 1;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05); /* 放大5%, Ken Burns效果 */
  transition: transform 6s ease;
}

.carousel-item.active img {
  transform: scale(1);
}

/* 遮罩层 */
.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 140px;
}

.carousel-text {
  text-align: center;
  color: white;
  padding: 20px;
  animation: fadeInUp 1s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-text h2 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-text p {
  font-size: 20px;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 导航按钮 */
.carousel-button {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.carousel-button:hover {
  background-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
}

.carousel-button.prev {
  left: 20px;
}

.carousel-button.next {
  right: 20px;
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

/* 指示器，白色小圆点 */
.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 指示器悬停状态，白色小圆点变亮 */
.indicator:hover {
  background-color: rgba(255, 255, 255, 0.7);
}

/* 指示器激活状态，白色长条 */
.indicator.active {
  background-color: white;
  width: 32px;
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel {
    height: 350px;
  }
  .carousel-overlay {
    padding-top: 60px;
  }
  .carousel-text h2 {
    font-size: 32px;
  }
  .carousel-text p {
    font-size: 16px;
  }
  .carousel-button {
    width: 40px;
    height: 40px;
  }
}
</style>