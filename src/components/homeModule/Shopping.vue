<template>
  <div class="item1" @click="turnTo" :style="props.layout">
    <div class="img_wrap">
      <img src="../../assets/images/routes/5.png" alt="">
    </div>
    <p class="label">{{$t('subPage.shopping.title')}}</p>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  layout: {
    type: Object
  }
})
const router = useRouter()
const turnTo = () => {
  router.push('/shopping')
}
</script>

<style lang="scss" scoped>
</style>