<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="inner_wrap" @click="turnBack" style="height: 100%;">
        <div class="btn_wrap" :style="{'justifyContent':'center'}">
          <div class="btn">{{$t('general.clickScreen')}}</div>
        </div>
        <div class="animate_wrap">
          <PlanRoute></PlanRoute>
        </div>
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
import { cancelMove, playBackSound, stopBackSound, playSound } from '../../utils/JSCallC'
import { robotNotice, removeRobotNotice } from '../../utils/CCallJS'

const { t } = useI18n()
const title = t('tip.turnBack', { robotName: t('general.robotName') })

onMounted(() => {
  playBackSound('navigating.wav', true)

  // 为了处理特殊情况：在充电桩上按住急停，然后从充电桩上移走，页面会停在15TurnBack卡死的问题
  setTimeout(() => {
    if(store.state.robotStatus.move_status !== 'running')
      router.push('/home')
  }, 1500)

  // 监听机器人回程过程中的通知
  robotNotice(dealNotice)
})

const dealNotice = (res: any) => {
  if(res.body.code === '01003') {
    playSound('移动任务失败')
    setTimeout(() => {
      router.push('/home')
    }, 5000)
  }else if(res.body.code === '01006') {
    // 将语音提示改为 “可以让让我吗”
    playSound('我被困住了')
  } else if(res.body.code === '01200') {
    playSound('可以让让我吗')
  }
}

const router = useRouter()
const turnBack = () => {
  // 立即取消当前返回 "待机点" 的导航任务
  cancelMove()
  router.push('/home')
}

const store = useStore()

// 1、监听机器人的状态move_status, 如果变成success, 则认为已经回到待机点，跳转回首页
// 2、机器人状态变为canceled，则表示中途的move指令被取消，也跳回首页
watch(() => store.state.robotStatus.move_status, (val, oldVal) => {
  if(val === 'succeeded' || val === 'canceled') {
    router.push('/home')
  }
})

onBeforeUnmount(() => {
  stopBackSound('navigating.wav')
  removeRobotNotice()
})

</script>

<style lang="scss" scoped>
.btn{
  width: auto !important;
  background: transparent !important;
  border: none !important;
  font-size: 45px !important;
}
</style>