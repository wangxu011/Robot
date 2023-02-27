<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <PlanRoute></PlanRoute>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
import { stopBackSound } from '../utils/JSCallC'

const { t } = useI18n()
const title = t('tip.estop')

onMounted(() => {
  stopBackSound('navigating.wav')
})

const store = useStore()
const router = useRouter()
watch(() => store.state.robotStatus?.estop_state, (val, oldVal) => {
  // 若已不再是“急停”，则返回上一次的路由页
  if(!val) {
    router.go(-1)
  }
})

</script>

<style lang="scss" scoped>
</style>