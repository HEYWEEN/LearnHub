import { createApp } from 'vue'
import App from './App.vue' // App.vue
import router from './router' // router/index.js
import { createPinia } from 'pinia' // store/index.js
// Element Plus 样式（按需加载时仍需要引入样式）
import 'element-plus/dist/index.css'
// Element Plus 暗色模式样式（可选）
// import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/styles/global.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
// Element Plus 已通过 unplugin-vue-components 自动按需导入，无需手动 use
app.mount('#app')
