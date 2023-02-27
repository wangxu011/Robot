<template>
  <div class="flight_info_wrap" v-loading="loading">
    <div class="header">
      <el-icon :size="55" color="#fff" @click="router.push('/home')">
        <arrow-left-bold />
      </el-icon>
      <div class="date">{{ date }}</div>
    </div>
    <div class="flight_wrap">
      <div class="left_part">
        <div class="top_line">
          <div class="place_wrap">
            <div class="cn">
              <LoopTextContainer>{{flightInfo.deptName}}</LoopTextContainer>
            </div>
            <div class="en">{{flightInfo.deptCode}}</div>
          </div>
          <div class="mid_wrap">
            <p class="no">
              <span>{{flightInfo.flightNo}} | </span>
              <span class="status">{{flightInfo.status}}</span>
            </p>
            <img src="../../assets/images/navigation/plane.png" />
          </div>
          <div class="place_wrap">
            <div class="cn">
              <LoopTextContainer>{{flightInfo.destName}}</LoopTextContainer>
            </div>
            <div class="en">{{flightInfo.destCode}}</div>
          </div>
        </div>
        <div class="bottom_line">
          <div class="item">
            <p class="label">
              <LoopTextContainer>{{$t('table.name')}}</LoopTextContainer>
            </p>
            <p class="value">
              <LoopTextContainer>{{flightInfo.name}}</LoopTextContainer>
            </p>
          </div>
          <div class="item">
            <p class="label">
              <LoopTextContainer>{{$t('table.gate')}}</LoopTextContainer>
            </p>
            <p class="value">{{flightInfo.gate || $t('general.unallocated')}}</p>
          </div>
          <div class="item">
            <p class="label">
              <LoopTextContainer>{{$t('table.departureTime')}}</LoopTextContainer>
            </p>
            <p class="value">{{flightInfo.departureTime}}</p>
          </div>
        </div>
      </div>
      <div class="right_part">
        <div class="img_wrap" @click="goToGate">
          <img src="../../assets/images/navigation/go.png" alt="">
        </div>
        <p class="text">
          <LoopTextContainer>{{$t('general.clickToNavigate')}}</LoopTextContainer>
        </p>
      </div>
    </div>
    <div class="map_wrap">
      <OpenLayer :name="flightInfo.gate"></OpenLayer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { playSound } from '../../utils/JSCallC'

import { formatToday } from '../../utils/timerFormatter'

import dayjs from 'dayjs'
import { createMsg } from '../../utils/message'

const router = useRouter()
const store = useStore()
const { t } = useI18n()

const loading = ref(false)

const date = ref('')

type FlightInfo = {
  name: string,
  gate: string,
  departureTime: string,
  deptName: string,
  deptCode: string,
  destName: string,
  destCode: string,
  flightNo: string,
  status: string
}
const flightInfo = ref<FlightInfo>({
  name: '',
  gate: '',
  departureTime: '',
  deptName: '',
  deptCode: '',
  destName: '',
  destCode: '',
  flightNo: '',
  status: ''
})

let timer: any = null
onMounted(() => { 
  date.value = formatToday()
  timer = setInterval(() => {
    date.value = formatToday()
  }, 60000)

  // 从数据中心获取1：N比对结果
  if('passengerName' in store.state.searchRes) {
    const obj =  store.state.searchRes
    flightInfo.value.name = obj.passengerName
    if(obj.flightInfo) {
      if(obj.flightInfo.gates.length)
        flightInfo.value.gate = obj.flightInfo.gates[0].gateNumber
      flightInfo.value.departureTime = dayjs(Number(obj.flightInfo.scheduleTime)).format('HH:mm')
      flightInfo.value.flightNo = obj.flightInfo.flightIdentity
      flightInfo.value.status = obj.flightInfo.flgihtStatus
      // 播报航班语音提示
      playSound(`${t('tip.foundFlightInfo', { robotName: t('general.robotName') })}${flightInfo.value.flightNo}`)
    }
    if(obj.dept) {
      flightInfo.value.deptName = obj.dept.airportName
      flightInfo.value.deptCode = obj.dept.airportIATACode
    }
    if(obj.dest) {
      flightInfo.value.destName = obj.dest.airportName
      flightInfo.value.destCode = obj.dest.airportIATACode
    }
  }
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

const goToGate = () => {
  if(!flightInfo.value.gate) {
    createMsg('warning', t('tip.gateNotExit'))
  }else {
    // 判断登机口对应的点位是否存在
    const markerList = store.state.markerList
    if(flightInfo.value.gate in markerList) {
      // 设置登机口作为终点的code
      store.commit('SET_DEST_CODE', flightInfo.value.gate)
      store.commit('SET_DEST_LABEL', flightInfo.value.gate)
      router.push('/3-PreAsk')
    }else {
      createMsg('warning', t('tip.gateNotExit'))
    }
  }
}

</script>

<style lang="scss" scoped>
.flight_info_wrap{
  height: 100%;
  .header{
    display: flex;
    align-items: center;
    .date{
      font-size: 40px;
      color: #A2A1A1;
      margin-left: 20px;
    }
  }
  .flight_wrap{
    height: 345px;
    margin-top: 40px;
    background-size: 100% 100%;
    background-image: url('../../assets/images/navigation/flight_info_bg.png');
    display: flex;
    justify-content: space-between;
    padding-top: 90px;
    .left_part{
      width: calc(100% - 290px);
      .top_line{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding: 0 10px;
        .place_wrap{
          width: 30%;
          .cn{
            font-size: 50px;
            font-weight: bold;
            color: #1D1D1D;
          }
          .en{
            font-size: 22px;
            color: #B7B6B6;
            margin-top: 10px;
          }
        }
        .mid_wrap{
          .no{
            font-size: 25px;
            color: #575757;
          }
        }
      }
      .bottom_line{
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        padding: 0 30px;
        .item{
          width: 33%;
          .label{
            font-size: 25px;
            color: #9A9A9A;
          }
          .value{
            font-size: 40px;
            color: #1D1D1D;
            font-weight: bold;
            margin-top: 10px;
          }
        }
      }
    }
    .right_part{
      width: 290px;
      .text{
        font-size: 30px;
        margin-top: 15px;
        font-weight: 500;
        padding: 0 15px;
      }
    }
  }
  .map_wrap{
    height: calc(100% - 520px);
    margin-top: 40px;
    background: #fff;
  }
}
</style>