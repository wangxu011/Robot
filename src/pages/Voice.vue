<template>
  <div class="voice_container">
    <div class="back" @click="back">  
      <el-icon :size="45" color="#fff">
        <close-bold />
      </el-icon>
    </div>
    <div class="gif_wrap">
      <img v-if="!input && robotState === 3" src="../assets/images/1.gif" alt="">
      <img v-if="input && robotState === 3" src="../assets/images/2.gif" alt="">
    </div>
    <!-- 当机器人处于working状态且用户还没有说话时显示 -->
    <div class="example" v-if="!input && robotState === 3">
      <p class="ask">{{$t('aiui.askMe')}}</p>
      <p class="item">{{$t('aiui.findFood')}}</p>
      <p class="item">{{$t('aiui.goToGate')}}</p>
      <p class="item">{{$t('aiui.flight')}}</p>
      <p class="item">{{$t('aiui.washroom')}}</p>
    </div>
    <!-- 当机器人状态变成ready时，且受到显示"继续询问"按钮 -->
    <div class="ask_again" v-if="(robotState === 2 && noSpeakFlag) || (robotState === 2 && reply)" @click="askAgain">
      <img src="../assets/images/4.gif" alt="">
      <p class="text">{{$t('aiui.clickToResume')}}</p>
    </div>
    <!-- 机器人在分析输入的空档期显示的动画 -->
    <div class="recieve_wrap" v-if="!noSpeakFlag && (robotState === 2 && !reply)">
      <img src="../assets/images/3.gif" style="height: 200px;">
    </div>
    <!-- 当机器人处于working状态且用户开始说话时显示 -->
    <el-scrollbar style="height: auto;">
      <p class="input_word" v-if="input && robotState === 3">{{input}}</p>
    </el-scrollbar>
    <!-- 机器人的回应文字显示 -->
    <el-scrollbar style="height: auto;">
      <p class="input_word" v-if="reply && robotState === 2">{{reply}}</p>
    </el-scrollbar>
    <div class="footer">
      <p class="welcome">—— {{$t('general.welcome')}} ——</p>
      <p class="powered">Powered By Reconova</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { setAIUIState, playSound } from '../utils/JSCallC'
import { AIUIDataEvent, removeAIUIDataEvent } from '../utils/CCallJS'

import { _getCategoryByLabel } from '../axios/api/categoryController'

import { AIUISwitchPageMap, categoryMap } from '../utils/generalMap'

let timer: NodeJS.Timer | null = null

const { t } = useI18n()

// 表示是否说过话
const noSpeakFlag = ref(true)

const robotState = ref(3)
const store = useStore()
// 监听store中存储的机器人状态：1: idle | 2: ready | 3: working
watch(() => store.state.robotState, (val, oldVal) => {
  console.log('robot state changed...')
  console.log('val: ', val)
  robotState.value = val
  // 当机器人状态变为 2 时，同时进行语音播报提醒
  if(val === 2) {
    timer = setTimeout(() => {
      playSound(t('aiui.clickToResumeTip'))
    }, 5000)
  }
  if(val === 3) {
    playSound('')
  }
})

onMounted(() => {
  // 监听客户端传递过来识别的语音文字
  AIUIDataEvent(dealAIUIRes)
})

const input = ref('')
const reply = ref('')
const dealAIUIRes = (res: any) => {
  console.log('res: ', res)
  input.value = ''
  reply.value = ''
  // type -> 0 ：表示是旅客的语音输入
  if(res.body.type === 0) {
    console.log('/***** INPUT *****/')
    if(res.body.text.text.ws && res.body.text.text.ws.length) {
      noSpeakFlag.value = false
      const ws = res.body.text.text.ws
      ws.forEach((item: any) => {
        input.value += item.cw[0].w
      })
    }
  // type -> 1 / 3 ：代表机器人的正常回复语句【包含讯飞语音库和自己的语音库】
  }else if(res.body.type === 1 || res.body.type === 3){
    console.log('/***** NORMAL OUTPUT *****/')
    reply.value = res.body.text.intent.answer.text
    // 清除上面播放 "若要继续使用，请点击屏幕上的继续询问按钮" 的定时器
    timer && clearTimeout(timer)
    // 同时用语音输出机器人的回复
    playSound(reply.value)
    store.commit('SET_AIUI_PLAYING', true)
    // 假设语音播报的速度为 3字符 / s，那么在播放完毕后将SET_AIUI_PLAYING置为false
    const playTime =  Math.ceil(reply.value.length / 3)
    setTimeout(() => {
      store.commit('SET_AIUI_PLAYING', false)
    }, playTime * 1000)
  // type -> 2 ：表示其他自定义行为
  }else if(res.body.type === 2){
    console.log('/***** MANUAL ACTION *****/')
    const actionType = res.body.text.intent.service.split('.')[1]
    console.log('actionType: ', actionType)
    /* 导航指令 */
    if(actionType === 'navigation') {
      // 将导航目的地的点位存到 store
      const destCode = res.body.text.intent.semantic[0].slots[0].normValue
      store.commit('SET_DEST_CODE', destCode)
      store.commit('SET_DEST_LABEL', destCode)
      // 跳转到 3-PreAsk 页面
      router.push('/3-PreAsk')
    /* 跳转到指定页面 */
    }else if(actionType === 'switch_page') {
      const pageName = res.body.text.intent.semantic[0].slots[0].normValue
      console.log('pageName: ', pageName)
      /* <1> 正常跳转 */
      if(pageName in AIUISwitchPageMap) {
        router.push(AIUISwitchPageMap[pageName].path)
        playSound(`${t('aiui.goto')}${t(AIUISwitchPageMap[pageName].name)}${t('aiui.page')}`)
      }else {
        // 2-1、是"找登机口"，直接跳转至刷脸页面
        if(pageName === '登机口') {
          router.push('/scanFace')
        // 2-2、是"交通指南"，需判断其模板类型，然后进行跳转
        }else if(pageName === '交通') {
          const label = '交通服务'
          _getCategoryByLabel(label).then(res => {
            // console.log(res)
            if(res.value) {
              router.push(`${categoryMap[res.value.module]}?label=${label}&id=`)
            }
          })
        }
      }
    }
  }
}

const router = useRouter()
const back = () => {
  router.push('/home')
}

const askAgain = () => {
  input.value = ''
  reply.value = ''
  // 重新将机器人的状态由ready置为working
  setAIUIState(3)
  noSpeakFlag.value = true
}

onBeforeUnmount(() => {
  removeAIUIDataEvent()
  if(timer)
    clearTimeout(timer)
})
</script>

<style lang="scss" scoped>
.voice_container{
  position: relative;
  height: 100%;
  padding-top: 320px;
  .back{
    position: absolute;
    top: 30px;
    right: 2px;
  }
  .gif_wrap{
    img{
      height: 200px;
    }
  }
  .example{
    margin-top: 100px;
    .ask{
      color: #fff;
      font-size: 60px;
      margin-bottom: 70px;
    }
    .item{
      color: #CBCBCB;
      font-size: 50px;
      line-height: 2em;
    }
  }
  .input_word{
    font-size: 60px;
    color: #fff;
    padding: 0 80px;
    line-height: 1.2em;
    max-height: 400px;
  }
  .ask_again{
    margin-bottom: 100px;
    img{
      height: 200px;
    }
    .text{
      font-size: 40px;
      color: #fff;
      margin-top: 15px;
    }
  }
  .footer {
    position: absolute;
    bottom: 53px;
    font-size: 22px;
    color: #00F4DE;
    left: 50%;
    transform: translateX(-50%);
    .powered{
      margin-top: 20px;
    }
  }
}
</style>