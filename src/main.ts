import { createApp } from 'vue'
import App from './App.vue'

import store from './store'
import router from './router'
import i18n from './i18n'

import './assets/styles/my-element-ui.scss'
import './assets/styles/general.scss'

import './assets/styles/quill.bubble.css'
import './assets/styles/quill.core.css'
import './assets/styles/quill.snow.css'

// element-plus/icons
import { CloseBold, ArrowLeft, ArrowLeftBold, HomeFilled, ArrowRight, Back, Aim} from '@element-plus/icons'

// 需要手动引入组件级的css，否则像messageBox这些的样式不会出现
// https://element-plus.gitee.io/zh-CN/guide/quickstart.html#manually-import
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/loading/style/css'

import ElementPlus from 'element-plus'

const app = createApp(App)
app.use(ElementPlus, { size: 'medium', zIndex: 3000 })

// 全局注册element-plus中的icon
app.component('close-bold', CloseBold)
app.component('arrow-left', ArrowLeft)
app.component('arrow-left-bold', ArrowLeftBold)
app.component('home-filled', HomeFilled)
app.component('arrow-right', ArrowRight)
app.component('back', Back)
app.component('aim', Aim)

app.use(router)
  .use(store)
  .use(i18n)
  .mount('#app')
