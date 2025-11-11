import { createApp } from 'vue'
import App from './App.vue' // App.vue
import router from './router' // router/index.js
import { createPinia } from 'pinia' // store/index.js
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/styles/global.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
