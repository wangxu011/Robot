<template>
  <div class="item2" @click="turnTo">
    <div class="img_wrap">
      <img src="../../assets/images/routes/1.png" alt="">
    </div>
    <p class="label">
      {{$t('subPage.scanFace.title')}}
    </p>
  </div>
</template>

<script lang="ts" setup>

const store = useStore()
const router = useRouter()
const turnTo = () => {
  // 如果ws没有连接，重新尝试连接一次
  if(!store.state.cameraWS?.isConnected()) {
    store.state.cameraWS?.connect()
    store.state.cameraBizWS?.connect()
  }
  router.push('/scanFace')
}
</script>

<style lang="scss" scoped>
</style>