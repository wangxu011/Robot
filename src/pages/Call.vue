<template>
  <div class="call_wrap">
    <div class="tip_wrap" v-html="title"></div>
    <div class="line"></div>
    <div class="content_wrap">
      <div class="img_wrap">
        <img src="../assets/images/navigation/call.png" alt="">
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { stopBackSound, playBackSound, playSound } from '../utils/JSCallC'
import { getPlanPath, removeGetPlanPath } from '../utils/CCallJS'
import { getDistance } from '../utils/tools'

const router = useRouter()
const route = useRoute()
const store = useStore()
const { t } = useI18n()
const title = ref(t('tip.callLocked'))

onMounted(() => {
  // 获取通过route传递过来的召唤点位code
  if(route.query.callPlace) {
    playBackSound('navigating.wav', true)
    playSound(title.value)
    // 监听前往 "召唤点" 过程中的规划路径
    getPlanPath(dealPath)
  }
})

const distance = ref(0)
const dealPath = (res: any) => {
  // 根据path中的第一个点与目的地点位计算距离终点的距离
  const destPose = store.state.markerList[String(route.query.callPlace)]
  const destCoor = [destPose.pose.position.x, destPose.pose.position.y]
  distance.value = getDistance(destCoor, res.body.path[0])
}

watch(distance, (val, oldVal) => {
  if(val <= 10) {
    title.value = `${t('tip.remainingDistance')} ${val} ${t('general.meter')}`
    if(!timer)
      startTimer()
  }
})

// 监听机器人是否运动到被召唤点位
watch(() => store.state.robotStatus.move_status, (val, oldVal) => {
  if(val === 'succeeded') {
    console.log('机器人已到达被召唤点位')
    // 跳转到 /3-PreAsk 页面
    router.push('/3-PreAsk')
  }else if(val === 'canceled') {
    // 召唤被取消，返回首页
    router.push('/home')
  }
})

let timer: NodeJS.Timer | null = null
const startTimer = () => {
  if(!timer) {
    timer = setInterval(() => {
      playSound(t('tip.pullOver', { robotName: t('general.robotName') }))
    }, 5000)
  }
}

onBeforeUnmount(() => {
  stopBackSound('navigating.wav')
  removeGetPlanPath()
  if(timer)
    clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.call_wrap{
  height: 100%;
  padding-top: 50px;
  .tip_wrap{
    height: 330px;
    font-size: 50px;
    font-weight: 400;
    color: #fff;
    line-height: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .line{
    height: 4px;
    background: linear-gradient(31deg, rgba(4, 218, 170, 0.81), rgba(84, 251, 251, 0.81));
    border-radius: 2px;
  }
  .content_wrap{
    height: calc(100% - 334px);
    position: relative;
    padding-top: 255px;
  }
}
</style>