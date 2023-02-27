<template>
  <div class="home_container">
    <div class="header">
      <div class="date" @click="exit">{{ date }}</div>
      <div class="right_wrapper">
        <div class="mic_wrap" @click="turnTo">
          <img src="../assets/images/mic.png" alt="">
        </div>
        <div class="lang_wrap">
          <el-select 
            v-model="locale"
            popper-class="switch_lang"
            @change="switchLang">
            <template #prefix>
              <img 
                :style="{width:'30px'}"
                :src="locale==='CN' ? CN : EN" />
            </template>
            <el-option
              v-for="item in langOpts"
              :key="item.value"
              :value="item.value"
              :label="item.label">
              <div class="option_wrap">
                <img :src="item.img" alt="">
                <span>{{ item.label }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <p class="title">{{$t('general.callMe', { robotName: $t('general.robotName') })}}</p>
    <div class="img_wrap">  
      <img src="../assets/images/hello-robot.png" alt="">
    </div>
    <div class="btn_wrap">
      <ScanFace></ScanFace>
      <FlightSchedule :layout="{marginLeft: '2%'}"></FlightSchedule>
      <AirportMap :layout="{marginTop: '2%'}"></AirportMap>
      <Food :layout="{marginTop: '2%', marginLeft: '2%'}"></Food>
      <Shopping :layout="{marginTop: '2%', marginLeft: '2%'}"></Shopping>
      <Facility :layout="{marginTop: '2%'}"></Facility>
      <Traffic :layout="{marginTop: '2%', marginLeft: '2%'}"></Traffic>
      <More :layout="{marginTop: '2%', marginLeft: '2%'}"></More>
    </div>
    <div class="logo_wrap">
      <img src="../assets/images/logo.png" alt="">
    </div>
    <div class="footer">
      <p class="welcome">—— {{$t('general.welcome')}} ——</p>
      <p class="powered">Powered By Reconova</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatToday } from '../utils/timerFormatter'

import { setCookie } from '../utils/cookies'

import { playSound, switchLanguage } from '../utils/JSCallC'
import { useRobot } from '../hooks/robot'

import CN from '../assets/images/cn.png'
import EN from '../assets/images/en.png'

const store = useStore()

const { goBackStandby } = useRobot()

const date = ref('')
let dateTimer: NodeJS.Timeout | null = null
let standbyTimer: NodeJS.Timeout | null = null
onMounted(() => {
  // playSound(t('general.callMe', { robotName: t('general.robotName') }))
  date.value = formatToday()
  dateTimer = setInterval(() => {
    date.value = formatToday()
  }, 60000)

  // 监听到有陌生人时，播放欢迎语
  linkCameraBiz()

  // 若30秒之内没有操作，则判断是否在待机点点位，若不在，则重新开启到待机点的任务
  standbyTimer = setTimeout(() => {
    goBackStandby()
  }, 30000)

  // 返回首页，清空存储的人脸底图与开箱密码
  if(store.state.verifyImage)
    store.commit('SET_VERIFY_IMAGE', '')
  if(store.state.secret)
    store.commit('SET_SECRET', '')
})

const linkCameraBiz = () => {
  // 1、先重置一次人脸上报，以防一进来时就有人脸导致不抓拍
  store.state.cameraBizWS?.send({'Service': 'SetFaceCapture', 'Body': { 'status': 2 }})
  // 2、订阅人脸上报
  store.state.cameraBizWS?.subscribe('ActiveReportPerson', playGreetVoice)
}

// 点击五次跳转到工程模式
let timer: NodeJS.Timer | null = null
let lastTime = new Date().getTime()
let count = 0
const maxCount = 5
const interval = 300
// 连续点击5次，退出到工程页面
const exit = () => {
  const currentTime = new Date().getTime()
  count = (currentTime - lastTime) < interval ? count + 1 : 1
  lastTime = new Date().getTime()
  if(timer)
    clearTimeout(timer)
  timer = setTimeout(() => {
    if(timer)
      clearTimeout(timer)
    // 5次点击
    if(count === maxCount) {
      router.push('/project')
    }
  }, interval)
}

// 增加监听: 解决当机器人在待机点时，调度任务修改了新的待机点，不会自动去新的待机点的问题
watch(() => store.state.robotConfig.homePosition, (val, oldVal) => {
  goBackStandby()
})

onBeforeUnmount(() => {
  dateTimer && clearInterval(dateTimer)
  standbyTimer && clearTimeout(standbyTimer)
})

const { locale, t } = useI18n()
const langOpts = [
  {
    label: '中文',
    value: 'CN',
    img: CN
  },
  {
    label: 'EN',
    value: 'EN',
    img: EN
  }
]

const switchLang = (e: string) => {
  // 传递给客户端，用于切换AIUI的语言库
  switchLanguage(e.toLowerCase())
  locale.value = e
  setCookie('lang', e)
}

const router = useRouter()
const turnTo = () => {
  router.push('/voice')
}

const playGreetVoice = () => {
  playSound(t('general.callMe', { robotName: t('general.robotName') }))
}

</script>

<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.home_container{
  position: relative;
  height: 100%;
  .header{
    @include centerBox;
    .date{
      font-size: 40px;
      color: #A2A1A1;
    }
    .right_wrapper{
      @include centerBox;
      :deep(.lang_wrap){
        margin-left: 10px;
        .el-select{
          width: 145px;
          .el-input{
            font-size: 22px;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            padding: 0 0 0 3px;
            .el-input__inner{
              font-size: 22px;
              height: 40px;
              line-height: 40px;
              border-radius: 20px;
              color: #fff;
              background-color: #525965;
              border: none;
              padding-left: 47px !important;
            }
            .el-input__prefix{
              left: 11px;
            }
            .el-input__suffix{
              right: 12px;
              .el-input__icon{
                line-height: 40px;
              }
            }
          }
        }
      }
    }
  }
  .title{
    font-size: 50px;
    color: #fff;
    margin-top: 80px;
    line-height: 1.2em;
  }
  .img_wrap{
    margin-top: 35px;
  }
  .btn_wrap{
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    div{
      height: 300px;
      border-radius: 15px;
      background: rgba(82, 89, 101, 0.65);
      color: #fff;
    }
  }
  .logo_wrap{
    margin-top: 178px;
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