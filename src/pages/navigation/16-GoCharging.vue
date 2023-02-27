<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="img_wrap" :style="{'paddingTop':'255px'}">
        <img src="../../assets/images/navigation/low_power.png" alt="">
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
import { move, playBackSound, stopBackSound } from '../../utils/JSCallC'
import { createMsg } from '../../utils/message'
import { moveExceptionMap } from '../../utils/generalMap'

const { t } = useI18n()
const title = t('tip.powerNotEnough', { robotName: t('general.robotName') })
const store = useStore()

const router = useRouter()
onMounted(() => {
  // 移动到充电桩点位
  move(store.state.robotConfig.chargingPile)?.then(res => {
    playBackSound('navigating.wav', true)
  })?.catch(err => {
    createMsg('warning', t(moveExceptionMap[String(err)]))
    router.push('/home')
  })
})

onBeforeUnmount(() => {
  stopBackSound('navigating.wav')
})
</script>

<style lang="scss" scoped>
</style>