<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 链接区域 -->
      <div class="footer-links">
        <div class="link-column">
          <h4>关于我们</h4>
          <a href="#">公司介绍</a>
          <a href="#">团队成员</a>
          <a href="#">加入我们</a>
        </div>
        
        <div class="link-column">
          <h4>联系方式</h4>
          <a href="#">在线客服</a>
          <a href="#">合作咨询</a>
          <a href="#">意见反馈</a>
        </div>
        
        <div class="link-column">
          <h4>隐私政策</h4>
          <a href="#">用户协议</a>
          <a href="#">隐私条款</a>
          <a href="#">版权声明</a>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="footer-divider"></div>

      <!-- 版权信息 -->
      <div class="footer-copyright">
        <p>&copy; 2025 LearnHub. All rights reserved.</p>
        <p class="footer-subtitle">致力于打造最优质的在线学习平台</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ecf0f1;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 24px;
}

/* 链接区域 */
.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.link-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-column h4 {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.link-column a {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.link-column a:hover {
  color: white;
  text-decoration: underline;
}

/* 分割线 */
.footer-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
  margin: 24px 0;
}

/* 版权信息 */
.footer-copyright {
  text-align: center;
}

.footer-copyright p {
  margin: 8px 0;
  font-size: 14px;
  color: #95a5a6;
}

.footer-subtitle {
  font-size: 12px;
  color: #7f8c8d;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-container {
    padding: 32px 16px 16px;
  }
}
</style>

