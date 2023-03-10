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
    // ??????????????????????????????????????????????????????cookie??????estop???true
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
title.value = `${t('tip.start')} ${store.state.destLabel}???${t('tip.attention')}`

// ??????????????????????????????1??????????????????2??????????????????3??????????????????
const state = ref(1)
onMounted(() => {
  // ????????????????????????
  if(store.state.destCode) {
    // ????????????????????????????????????????????????????????????move??????????????????????????????????????????????????????
    if(getCookie('estop') === 'true') {
      getPlanPath(dealPath)
      robotNotice(dealNotice)
      playBackSound('navigating.wav', true)
    }else {
      move(store.state.destCode)?.then(res => {
        // ??????????????????????????????
        getPlanPath(dealPath)
        // ???????????????????????????????????????
        robotNotice(dealNotice)
        // ????????????
        playBackSound('navigating.wav', true)

        // ?????????????????????move_status????????????succeeded????????????????????????
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

// ?????????????????????JSON?????????????????????Leaflet??????
const planRoute = ref('')

// ???????????????????????????????????????????????????
const distance = ref(0)

// ???????????? - ???????????????????????????????????????0.7 m/s
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
 * ??????????????????????????????
 * ?????????????????????????????????????????????????????????????????????
 */
watch(() => store.state.robotStatus.move_status, (val, oldVal) => {
  if(val === 'succeeded') {
    console.log('?????????????????????')
    // ??????????????????
    finish()
  }
})

// ?????????????????????????????????????????????
const dealPath = (res: any) => {
  // ????????????????????????
  planRoute.value = JSON.stringify(res.body.path)
  // ??????path???????????????????????????????????????????????????????????????
  const destPose = store.state.markerList[store.state.destCode]
  const destCoor = [destPose.pose.position.x, destPose.pose.position.y]
  distance.value = getDistance(destCoor, res.body.path[0])
}

// ??????????????????????????????????????????????????????
const dealNotice = (res: any) => {
  // ???????????????code??????01003???????????????????????????01006????????????????????????????????????
  if(res.body.code === '01003') {
    playSound('??????????????????')
    setTimeout(() => {
      router.push('/home')
    }, 5000)
  }else if(res.body.code === '01006') {
    // ????????????????????? ????????????????????????
    playSound('???????????????')
  } else if(res.body.code === '01200') {
    playSound('??????????????????')
  }
}

const getDistance = (p1: number[], p2: number[]):number => {
  const x2 = Math.pow(p1[0] - p2[0], 2)
  const y2 = Math.pow(p1[1] - p2[1], 2)
  return Math.ceil(Math.pow((x2 + y2), 0.5))
}

// ????????????
const pause = () => {
  upperOpenSuspendLight(0)
  state.value = 2
  title.value = t('tip.paused')
  cancelMove()
  stopBackSound('navigating.wav')
}
// ????????????
const goOn = () => {
  upperOpenSuspendLight(1)
  state.value = 1
  title.value = `${t('tip.start')} ${store.state.destCode}???${t('tip.attention')}`
  playBackSound('navigating.wav', true)
  if(store.state.destCode) {
    move(store.state.destCode)?.catch(err => {
      router.push('/home')
      createMsg('warning', t(moveExceptionMap[String(err)]), 3000)
      playSound(t(moveExceptionMap[String(err)]))
    })
  }
}
// ????????????
const finish = () => {
  upperOpenSuspendLight(1)
  state.value = 3
  title.value = t('tip.finished')
  planRoute.value = '[]'
  distance.value = 0
  stopBackSound('navigating.wav')
}
// ?????????
const sayBye = () => {
  // ????????? "????????????" ??????
  router.push('/14-ThanksForUse')
}
// ????????????
const fetchPackage = () => {
  // ????????? "????????????" ??????
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