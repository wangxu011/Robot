<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="btn_wrap">
        <div class="btn" @click="ok">
          <LoopTextContainer>{{$t('general.ok')}}</LoopTextContainer>
        </div>
        <div class="btn" @click="reject">
          <LoopTextContainer>{{$t('general.no')}}</LoopTextContainer>
        </div>
      </div>
      <div class="img_wrap">
        <img src="../../assets/images/navigation/package.png" alt="">
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>

const router = useRouter()
const store = useStore()

const { t } = useI18n()
const title = `${t('general.prepareGo')} ${store.state.destLabel} ， <br />${t('general.needHelp', { robotName: t('general.robotName') })}`

onMounted(() => {
  linkCameraBiz()
})

const linkCameraBiz = () => {
  // 1、先重置一次人脸上报，以防一进来时就有人脸导致不抓拍
  store.state.cameraBizWS?.send({'Service': 'SetFaceCapture', 'Body': {'status': 2 }})
  // 2、订阅人脸上报
  store.state.cameraBizWS?.subscribe('ActiveReportPerson', dealCaptureFace)
}

const ok = () => {
  router.push('/4-SetPassword')
}

const dealCaptureFace = (data) => {
  if(data.PersonTraceInfoList.length) {
    const faceRes = data.PersonTraceInfoList[0]
    // 将人脸存入store，作为开箱比对的底图
    store.commit('SET_VERIFY_IMAGE', faceRes.FaceImage)
  }
}

const reject = () => {
  // 直接跳转到 8-PlanRoute 页面（行进路线规划中）
  router.push('/8-PlanRoute')
}
</script>

<style lang="scss" scoped>
</style>