<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Layout from './components/layout/Layout.vue'

import { getMarkerList as getMarker, getCurrentMapInfo as getMapInfo, switchLanguage } from './utils/JSCallC'
import { AIUIState, robotStatus, getMarkerList as recieveMarker, getCurrentMapInfo as recieveMapInfo, setWebUiConfig, callRobot } from './utils/CCallJS'

import { setCookie } from './utils/cookies'
import Socket from './webSocket'

onMounted(() => {
  // 监听AIUI的状态
  AIUIState(dealState)

  // 监听机器人状态
  robotStatus(dealRobotStatus)

  // 获取所有marker列表，将结果存到store
  getMarker()
  recieveMarker((res: any) => {
    store.commit('SET_MARKER_LIST', res.body)
  })

  // 获取地图基础信息
  getMapInfo()
  recieveMapInfo((res: any) => {
    store.commit('SET_MAP_INFO', res.body)
  })

  // 获取机器人全局配置
  setWebUiConfig(dealWebConfig)

  // 监听 "召唤" 指令
  callRobot(dealCallRobot)

  // 没有操作时，自动返回首页，超时配置在config.js
  autoBackToHome()

  /**
   * 测试WebSocket连接，兼容新、老版本客户端软件
   * 频繁调用并创建ws实例会造成资源浪费，且会出现WebSocket opening handshake timed out报错
   */
   testConnectWS()
})

const route = useRoute()
const router = useRouter()
const store = useStore()

const dealState = (res: any) => {
  store.commit('SET_AIUI_STATE', res.body.state)
  // 在首页感知到状态变化，即为"唤醒"
  if(route.path === '/home' && res.body.state === 3) {
    router.push('/voice')
  }
}

// 将机器人状态存入store
const dealRobotStatus = (res: any) => {
  // 当机器人的 move_status 值为failed时，跳回首页【兜底处理机器人移动过程中出现异常的情况】
  if(res.body.move_status === 'failed' && route.path !== '/home' && store.state.robotStatus.move_status !== 'failed')
    router.push('/home')
    
  store.commit('SET_ROBOT_STATUS', res.body)
  // 如果机器人处于运行状态，则重置超时返回首页定时器
  if(res.body.move_status === 'running')
    resetTimer()
  // 判断机器人是否为“急停”状态，跳转至 /estop 页面【急停优先级最高】
  if(res.body.estop_state) {
    console.log('/******** 急停状态 ********/')
    router.push('/estop')
    return
  }
  // 判断机器人是否为充电状态，需跳转至 /charging 页面
  if(res.body.charge_state && route.path !== '/charging') {
    console.log('/******** 充电状态 ********/')
    router.push('/charging')
    return
  }
  // 判断机器人若处于“充电中”页面，但状态变为“未充电”时，即为离开充电桩，跳转到 /15-TurnBack 页面
  if(!res.body.charge_state && route.path === '/charging')
    router.push('/15-TurnBack')
}

// 将机器人全局配置存入store【包含各种电量阈值、充电桩、待机点】
const dealWebConfig = (res: any) => {
  store.commit('SET_ROBOT_CONFIG', res.body)
  // 将fids服务对应的server存入cookie中
  setCookie('fidsIP', res.body.faceServerHttpAddress)
}

const dealCallRobot = (res: any) => {
  if(res.body.marker) {
    store.commit('SET_DEST_CODE', res.body.destMarker)
    store.commit('SET_DEST_LABEL', res.body.destMarker)
    router.push(`/call?callPlace=${res.body.marker}`)
  }
}

let backHomeTimer: NodeJS.Timer | null = null
const autoBackToHome = () => {
  resetTimer()
  document.addEventListener('click', resetTimer)
  document.addEventListener('touchstart', resetTimer)
  document.addEventListener('input', resetTimer)
}

const { locale } = useI18n()
const resetTimer = () => {
  if(backHomeTimer)
    clearInterval(backHomeTimer)
  backHomeTimer = setInterval(() => {
    // 不跳转回首页的页面集合
    const noBackRouteList = ['/charging', '/estop', '/5-OpeningDoor', '/6-PutPackage', '/7-CheckPackage', '/15-TurnBack']
    // 不跳转回首页的条件集合
    const notTurnBackConditionsFlag = 
      (store.state.robotStatus.move_status === 'running') ||          // 机器人状态为运动状态
      (noBackRouteList.indexOf(route.path) !== -1) ||                 // 页面处在上述集合中
      (store.state.secret) ||                                         // 存在行李【开箱密码存在代表存在行李】
      (store.state.AIUIPlaying)                                       // AIUI处在播放语音状态
    
    if(notTurnBackConditionsFlag) {
      resetTimer()
    }else {
      if(route.path !== '/home')
        router.push('/home')
      // 判断如果此时是 "英文" 模式的话，返回首页时自动切换成 "中文"
      if(locale.value === 'EN') {
        locale.value = 'CN'
        setCookie('lang', 'CN')
        switchLanguage('CN')
      }
    }
  }, config.returnHomeTimeout * 1000)
}

// 监控机器人电量
watch(() => store.state.robotStatus.power_percent, (val, oldVal) => {
  // 当机器人处于非充电状态，且电量已低于最低电量阈值，且机器人不是运动状态，则自动回到充电桩进行充电
  if(!store.state.robotStatus.charge_state && 
      val < store.state.robotConfig.waterLowestPower &&
      store.state.robotStatus.move_status !== 'running') {
    router.push('/16-GoCharging')
  }
})

/**
 * 创建连接WebSocket实例
 */
 const testConnectWS = () => {
  const cameraWS = new Socket(config.ws.camera, 'camera')
  const cameraBizWS = new Socket(config.ws.cameraBiz, 'cameraBiz')
  console.log('create camera ws instance...')
  store.commit('SET_CAMERA_WS', cameraWS)
  console.log('create cameraBiz ws instance...')
  store.commit('SET_CAMERA_BIZ_WS', cameraBizWS)
}

onBeforeUnmount(() => {
  store.state.cameraWS?.close()
  store.state.cameraBizWS?.close()
  store.commit('SET_CAMERA_WS', null)
  store.commit('SET_CAMERA_BIZ_WS', null)
})

</script>

<template>
  <Layout></Layout>
</template>

<style lang="scss">
html, body{
  margin: 0;
  padding: 0;
  height: 100%;
  touch-action: none;
}
body, div, p, ul, ol, h1, h2, h3 {
  margin: 0;
  padding: 0;
  line-height: 1;
  box-sizing: border-box;
}
#app {
  height: 100%;
  font-family: 'Alibaba PuHuiTi';
  // font-family: '隶书';
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/** 隐藏openlayers中的zoom按钮*/
.ol-zoom{
  display: none;
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
</style>
