<template>
  <div class="item1" @click="turnTo" :style="props.layout">
    <div class="img_wrap">
      <img src="../../assets/images/routes/6.png" alt="">
    </div>
    <p class="label">{{$t('subPage.facility.title')}}</p>
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
  router.push('/Facility')
}
</script>

<style lang="scss" scoped>
</style>