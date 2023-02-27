<template>
  <div class="item1" @click="turnTo" :style="props.layout">
    <div class="img_wrap">
      <img src="../../assets/images/routes/4.png">
    </div>
    <p class="label">{{$t('subPage.food.title')}}</p>
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
  router.push('/food')
}
</script>

<style lang="scss" scoped>
</style>