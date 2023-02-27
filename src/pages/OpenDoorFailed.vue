<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="btn_wrap">
        <div class="btn" @click="reopen">
          <LoopTextContainer>{{$t('general.retryOpen')}}</LoopTextContainer>
        </div>
        <div class="btn" @click="go">
          <LoopTextContainer>{{$t('general.startNavigate')}}</LoopTextContainer>
        </div>
      </div>
      <div class="img_wrap">
        <img src="../assets/images/navigation/open_door_failed.png" alt="">
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
const router = useRouter()
const store = useStore()
const { t } = useI18n()
const title = `${t('tip.openDoorFailed')}`

const go = () => {
  // 直接跳转到导航页面，清空之前抓拍的人脸和输入的开箱密码
  store.commit('SET_VERIFY_IMAGE', '')
  store.commit('SET_SECRET', '')
  // 跳转到 8-PlanRoute 页面
  router.push('/8-PlanRoute')
}
const reopen = () => {
  // 跳转到 5-OpeningDoor 页面
  router.push('/5-OpeningDoor')
}
</script>

<style lang="scss" scoped>

</style>