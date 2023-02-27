import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

import { currentStatus, setAIUIState } from '../utils/JSCallC'

import pages from './routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  ...pages
]

const router: Router = createRouter({
  history: createWebHistory('/ui_robot/'),
  routes
})

const businessObj = {
  'Home': '0',
  'Food': '10',
  'Shopping': '11',
  'Facility': '12',
  'ScanFace': '13',
  'Voice': '14',
  'Exit': '15',  // "机场出口" 页面暂时没有
  'Map': '16',
  'Flight': '17',
  'Other': '99'
}

// AIUI处于就绪的页面列表：state -> 2
const readyState = ['Home']

// AIUI处于工作中的页面列表：state -> 3
const workingState = ['Voice']

router.beforeEach((to, from) => {
  const name: string = String(to.name)
  console.log('page name: ', name)
  // 当前只有 "首页" 和 "15-TurnBack" "14-ThanksForUse" 表示空闲状态
  const status = name === 'Home' || name === '15TurnBack' || name === '14ThanksForUse' ? 0 : 1
  console.log('page status: ', status)

  // businessObj 中存在的页面设置对应的code，其余均不统计
  if(name in businessObj) {
    // 设置当前页面的状态
    currentStatus(businessObj[name], status)
  }else {
    // 其他页面约定code值为 '9999'，表示这些页面均不需统计
    currentStatus('9999', status)
  }
  
  // 设置AIUI的状态
  if(readyState.indexOf(name) !== -1) {
    setAIUIState(2)
  }else if(workingState.indexOf(name) !== -1) {
    setAIUIState(3)
  }else {
    setAIUIState(1)
  }
})

export default router