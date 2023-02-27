<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="btn_wrap"
        v-if="state === 1"
        :style="{'justifyContent':'center'}">
        <div class="btn" @click="pause">
          <LoopTextContainer>{{$t('general.pause')}}</LoopTextContainer>
        </div>
      </div>
      <div class="btn_wrap"
        v-if="state === 2">
        <div class="btn" @click="goOn">
          <LoopTextContainer>{{$t('general.continue')}}</LoopTextContainer>
        </div>
        <div class="btn" @click="finish">
          <LoopTextContainer>{{$t('general.finish')}}</LoopTextContainer>
        </div>
      </div>
      <div class="btn_wrap"
        v-if="state === 3"
        :style="{'justifyContent':'center'}">
        <div class="btn" @click="sayBye" v-if="!store.state.secret">
          <LoopTextContainer>{{$t('general.sayBye', { robotName: $t('general.robotName')})}}</LoopTextContainer>
        </div>
        <div class="btn" @click="fetchPackage" v-else>
          <LoopTextContainer>{{$t('general.getOutPackage')}}</LoopTextContainer>
        </div>
      </div>
      <div class="map_wrap">
        <LeafletMap :paths="planRoute"></LeafletMap>
      </div>
      <div class="footer">
        <div class="item">
          <div class="icon_wrap">
            <img src="../../assets/images/navigation/distance.png" alt="">
          </div>
          <div class="right_wrap">
            <p class="label">
              {{$t('general.distance')}}
            </p>
            <p class="label">
              <span>{{ distance }}&nbsp;</span>
              <span>{{$t('general.meter')}}</span>
            </p>
          </div>
        </div>
        <div class="item">
          <div class="icon_wrap">
            <img src="../../assets/images/navigation/timer.png" alt="">
          </div>
          <div class="right_wrap">
            <p class="label">
              {{$t('general.remainedTime')}}
            </p>
            <p class="label">{{ restTime }}</p>
          </div>
        </div>
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setCookie } from '../../utils/cookies'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // 如果页面是由急停页面返回的，那么设置cookie变量estop为true
    if(from.path === '/estop')
      setCookie('estop', true)
    next()
  }
})
</script>

<script lang="ts" setup>
import { getCookie } from '../../utils/cookies'
import { move, cancelMove, upperOpenSuspendLight, playSound, playBackSound, stopBackSound } from '../../utils/JSCallC'
import { getPlanPath, removeGetPlanPath, robotNotice, removeRobotNotice } from '../../utils/CCallJS'
import { createMsg } from '../../utils/message'
import { moveExceptionMap } from '../../utils/generalMap'

const store = useStore()
const router = useRouter()

const { t } = useI18n()
const title = ref('')
title.value = `${t('tip.start')} ${store.state.destLabel}，${t('tip.attention')}`

// 标识当前的导航状态：1：开始导航；2：暂停导航；3：导航结束；
const state = ref(1)
onMounted(() => {
  // 调用开始导航任务
  if(store.state.destCode) {
    // 如果是从急停页面返回的，那么不需再次调用move，只需播放背景音乐，绘制规划路径即可
    if(getCookie('estop') === 'true') {
      getPlanPath(dealPath)
      robotNotice(dealNotice)
      playBackSound('navigating.wav', true)
    }else {
      move(store.state.destCode)?.then(res => {
        // 开始监听获取导航路径
        getPlanPath(dealPath)
        // 监听机器人导航过程中的通知
        robotNotice(dealNotice)
        // 播放音乐
        playBackSound('navigating.wav', true)

        // 如果一加载进来move_status就已经是succeeded，则直接导航结束
        setTimeout(() => {
          if(store.state.robotStatus.move_status === 'succeeded')
            finish()
        }, 2000)
      })?.catch(err => {
        router.push('/home')
        createMsg('warning', t(moveExceptionMap[String(err)]), 3000)
        playSound(t(moveExceptionMap[String(err)]))
      })
    }
  }
})

// 路径点的集合的JSON字符串，传递给Leaflet组件
const planRoute = ref('')

// 剩余距离【目前只取两点间直线距离】
const distance = ref(0)

// 计算属性 - 导航剩余时间，机器人速度：0.7 m/s
const restTime = computed(() => {
  if(distance) {
    const time = Math.ceil(distance.value / 0.7)
    if(time > 60) {
      const min = Math.floor(time / 60)
      const sed = time % 60
      return `${min} ${t('general.min')} ${sed} ${t('general.sed')}`
    }else {
      return time === 60 ? `1 ${t('general.min')}` : `${time} ${t('general.sed')}`
    }
  }else {
    return `0 ${t('general.sed')}`
  }
})

/**
 * 监听机器人的运动状态
 * 由于客户端不想实现当导航结束时对规划路径的处理
 */
watch(() => store.state.robotStatus.move_status, (val, oldVal) => {
  if(val === 'succeeded') {
    console.log('标志着导航结束')
    // 将路径置为空
    finish()
  }
})

// 处理实时接收到的规划路径的方法
const dealPath = (res: any) => {
  // 拿到路径点的集合
  planRoute.value = JSON.stringify(res.body.path)
  // 根据path中的第一个点与目的地点位计算距离终点的距离
  const destPose = store.state.markerList[store.state.destCode]
  const destCoor = [destPose.pose.position.x, destPose.pose.position.y]
  distance.value = getDistance(destCoor, res.body.path[0])
}

// 处理接收到的机器人导航过程中发的通知
const dealNotice = (res: any) => {
  // 当前只处理code为：01003（移动任务失败），01006（机器人被困住）两种情况
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

const getDistance = (p1: number[], p2: number[]):number => {
  const x2 = Math.pow(p1[0] - p2[0], 2)
  const y2 = Math.pow(p1[1] - p2[1], 2)
  return Math.ceil(Math.pow((x2 + y2), 0.5))
}

// 暂停导航
const pause = () => {
  upperOpenSuspendLight(0)
  state.value = 2
  title.value = t('tip.paused')
  cancelMove()
  stopBackSound('navigating.wav')
}
// 继续导航
const goOn = () => {
  upperOpenSuspendLight(1)
  state.value = 1
  title.value = `${t('tip.start')} ${store.state.destCode}，${t('tip.attention')}`
  playBackSound('navigating.wav', true)
  if(store.state.destCode) {
    move(store.state.destCode)?.catch(err => {
      router.push('/home')
      createMsg('warning', t(moveExceptionMap[String(err)]), 3000)
      playSound(t(moveExceptionMap[String(err)]))
    })
  }
}
// 结束导航
const finish = () => {
  upperOpenSuspendLight(1)
  state.value = 3
  title.value = t('tip.finished')
  planRoute.value = '[]'
  distance.value = 0
  stopBackSound('navigating.wav')
}
// 说再见
const sayBye = () => {
  // 跳转至 "感谢使用" 页面
  router.push('/14-ThanksForUse')
}
// 取出行李
const fetchPackage = () => {
  // 跳转至 "核验人脸" 页面
  router.push('/10-VerifyFace')
}

onBeforeUnmount(() => {
  removeGetPlanPath()
  removeRobotNotice()
  stopBackSound('navigating.wav')
  setCookie('estop', false)
})
</script>

<style lang="scss" scoped>
.map_wrap{
  height: calc(100% - 350px);
  margin-top: 45px;
}
.footer{
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  .item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon_wrap{
      width: 70px;
      img{
        width: 100%;
      }
    }
    .right_wrap{
      font-size: 40px;
      color: #fff;
      margin-left: 15px;
    }
  }
}
</style>