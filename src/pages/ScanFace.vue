<template>
  <SubLayout>
    <div class="scan_face_container">
      <p class="title">{{title}}</p>
      <div class="img_wrap">  
        <img src="../assets/images/hello-robot.png" alt="">
      </div>
      <div class="video_wrap">
        <img class="socket_img" :src="wsImg" alt="">
      </div>
      <div class="logo_wrap">
        <img src="../assets/images/logo.png" alt="">
      </div>
      <div class="footer">
        <p class="welcome">—— {{$t('general.welcome')}} ——</p>
        <p class="powered">Powered By Reconova</p>
      </div>
    </div>
  </SubLayout>
</template>

<script lang="ts" setup>
import { playSound, playBackSound } from '../utils/JSCallC'

import { _searchByFace } from '../axios/api/flightController'

const { t } = useI18n()
// webSocket传过来的图片
const wsImg = ref('')
const title = t('subPage.scanFace.tip')

onMounted(() => {
  // 播放提示语
  playSound(title)

  // 连接WebSocket，获取抓拍相机实时视频
  linkCamera()

  // 连接WebSocket，连接与摄像头程序之间的业务逻辑通信
  linkCameraBiz()
})

// Camera/Video
const linkCamera = () => {
  // 订阅实时抓拍视频流
  store.state.cameraWS?.subscribe('faceCapture', dealCameraImg)
}
const dealCameraImg = (data) => {
  wsImg.value = data.data
}

// Camera/Control
const linkCameraBiz = () => {
  // 1、先重置一次人脸上报，以防一进来时就有人脸导致不抓拍
  store.state.cameraBizWS?.send({'Service': 'SetFaceCapture', 'Body': { 'status': 2 }})
  // 2、订阅人脸上报
  store.state.cameraBizWS?.subscribe('ActiveReportPerson', dealCaptureFace)
}

const router = useRouter()
const store = useStore()
// 将抓拍得到的人脸去做1：N比对
const dealCaptureFace = (data) => {
  if(data.PersonTraceInfoList.length) {
    const faceRes = data.PersonTraceInfoList[0]
    // 调用1：N接口
    _searchByFace(faceRes.FaceImage).then(res => {
      console.log('search face res: ', res)
      // code === 200，比中，将结果存入store
      if(res.code === 200) {
        playBackSound('facematch_success.wav', false)
        store.commit('SET_SEARCH_RES', res.value)
        router.push('/2-FlightInfo')
      }else {
        playBackSound('facematch_failed.wav', false)
        router.push('/misMatch')
      }
    }).catch(err => {
      // 调用航信比对接口出错，也看作比对失败，跳转至 ‘未比中’ 页面
      playBackSound('facematch_failed.wav', false)
      router.push('/misMatch')
    })
  }
}

onBeforeUnmount(() => {
  store.state.cameraWS?.unsubscribe('faceCapture')
  store.state.cameraBizWS?.unsubscribe('ActiveReportPerson')
})
</script>

<style lang="scss" scoped>
.scan_face_container{
  height: 100%;
  position: relative;
  .title{
    font-size: 50px;
    color: #fff;
    line-height: 1.2em;
  }
  .img_wrap{
    margin-top: 35px;
  }
  .video_wrap{
    height: 990px;
    margin-top: 65px;
    position: relative;
    overflow: hidden;
    .socket_img{
      position: absolute;
      height: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .logo_wrap{
    margin-top: 100px;
  }
  .footer {
    position: absolute;
    bottom: -47px;
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