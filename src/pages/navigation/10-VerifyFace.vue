<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="img_wrap" :style="{'paddingTop':'255px'}">
        <Loading></Loading>
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>

const { t } = useI18n()
const title = t('tip.verifyFace')
const store = useStore()
const router = useRouter()

let timer: NodeJS.Timeout | null = null
onMounted(() => {
  
  // 超过 5S 没有收到图片，则跳转到 /12-VerifyFailed
  timer = setTimeout(() => {
    router.push('/12-VerifyFailed')
  }, 5000)

  // 连接WebSocket，连接与摄像头程序之间的业务逻辑通信
  linkCameraBiz()
})

const linkCameraBiz = () => {
  // 1、重置以防不抓拍
  store.state.cameraBizWS?.send({'Service': 'SetFaceCapture', 'Body': {'status': 2 }})
  // 2、订阅人脸上报
  store.state.cameraBizWS?.subscribe('ActiveReportPerson', dealCaptureFace)
  // 3、订阅接收1:1比对结果
  store.state.cameraBizWS?.subscribe('ImageFileMatch', dealSearchRes)
} 

const dealCaptureFace = (data) => {
  // 清除定时器
  timer && clearTimeout(timer)
  // 在收到人脸后，则不再订阅
  store.state.cameraBizWS?.unsubscribe('ActiveReportPerson')

  // 发送存储在数据中心的底图
  const body = {
    'Service': 'ImageFileMatch',
    'Body': {
      'DpsrID': '',
      'IDCardNO': '',
      'ImageFileData': store.state.verifyImage
    }
  }
  // 发现有人脸上报后，发送1:1比对请求
  store.state.cameraBizWS?.send(body)
}

const dealSearchRes = (data) => {
  console.log('search res: ', data)
  // 比对成功
  if(data.IsSamePerson === 1) {
    router.push('/11-VerifySuccess')
  }else {
    router.push('/12-VerifyFailed')
  }
}
</script>

<style lang="scss" scoped>
</style>