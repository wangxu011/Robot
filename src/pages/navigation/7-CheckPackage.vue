<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="btn_wrap">
        <div class="btn" @click="go">
          <LoopTextContainer>{{$t('general.goNow')}}</LoopTextContainer>
        </div>
        <div class="btn" @click="reopen">
          <LoopTextContainer>{{$t('general.reopen')}}</LoopTextContainer>
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
const title = `${t('general.prepareGo')} ${store.state.destLabel}, ${t('general.confirmPackage')}`

const go = () => {
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