<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="img_wrap" :style="{'paddingTop':'255px'}">
        <img src="../../assets/images/navigation/bye.png" alt="">
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
import { useRobot } from '../../hooks/robot'

const router = useRouter()
const store = useStore()

const { t } = useI18n()
const title = t('tip.thanksForUse', { robotName: t('general.robotName') })

const { goBackStandby } = useRobot()
let timer: NodeJS.Timer | null = null
onMounted(() => {
  // 标志着一次导航的结束，将存储的人脸，密码置空
  store.commit('SET_SECRET', '')
  store.commit('SET_VERIFY_IMAGE', '')

  // 等待8S之后（让机器人播放完提示语音），判断当前机器人电量
  timer = setTimeout(() => {
    // 电量小于 30 ，则返回充电桩
    if(store.state.robotStatus.power_percent < store.state.robotConfig.waterLowestPower) {
      router.push('/16-GoCharging')
    }else {
      // 根据智慧调度的配置，回到配置的待机点点位
      goBackStandby()
    }
  }, 8000)
})

onBeforeUnmount(() => {
  if(timer)
    clearTimeout(timer)
})
</script>

<style lang="scss" scoped>

</style>