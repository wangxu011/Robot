<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="img_wrap" :style="{'paddingTop':'255px'}">
        <loading></loading>
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
import { stopBackSound } from '../utils/JSCallC'
import { useRobot } from '../hooks/robot'

const store = useStore()
const { t } = useI18n()  
const title = t('tip.charging', { robotName: t('general.robotName') })

const { goBackStandby } = useRobot()

onMounted(() => {
  console.log('entry charging page ...')
  stopBackSound('navigating.wav')
  startTimer()
})

let timer: NodeJS.Timer | null = null
const startTimer = () => {
  console.log('waterTargetPower: ', store.state.robotConfig.waterTargetPower)
  timer = setInterval(() => {
    // 当机器人电量超过充电上限时，导航至待机点位
    const targetPower = store.state.robotConfig.waterTargetPower || 80
    if(store.state.robotStatus.power_percent >= targetPower) {
      // 移动到待机点，先判断当前位置是否为待机点
      goBackStandby()
    }
  }, 3000)
}

onBeforeUnmount(() => {
  timer && clearInterval(timer)
})
</script>

<style lang="scss" scoped>
</style>