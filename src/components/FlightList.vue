<template>
  <div class="flight_list_wrap" :style="{height: props.height}">
    <!-- 出发航班 -->
    <el-table
      v-load-more="123"
      :data="props.data" 
      v-if="props.direction === 'D'" 
      height="forScroll"
      :empty-text="$t('general.noData')">
      <el-table-column align="center" width="190">
        <template #header>
          <p>{{$t('table.flight')}}</p>
        </template>
        <template #default="scope">
          <div style="height: 30px;">
            <RollUpContainer 
              :list="scope.row.shareList"
              type="flight">
            </RollUpContainer>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template #header>
          <p>{{$t('table.sched')}}</p>
        </template>
        <template #default="scope">
          <span style="color: #FDCCB4;">
            {{scope.row.scheduleTime ? dayjs(Number(scope.row.scheduleTime)).format('HH:mm'): '-'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="250">
        <template #header>
          <p>{{$t('table.dest')}}</p>
        </template>
        <template #default="scope">
          <div :style="{width: '100%', height:'24px'}">
            <RollUpContainer :list="scope.row.destsList" type="text"></RollUpContainer>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="130">
        <template #header>
          <p>{{$t('table.terminal')}}</p>
        </template>
        <template #default="scope">
          {{scope.row.terminal === 'T1' ? 'T3' : scope.row.terminal}}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template #header>
          <p>{{$t('table.gate')}}</p>
        </template>
        <template #default="scope">
          <LoopTextContainer>
            <span>{{scope.row.gateLabel ? scope.row.gateLabel : $t('general.unallocated')}}</span>
          </LoopTextContainer>
          <img
            v-if="scope.row.gateLabel && scope.row.terminal === 'T4'"
            :style="{width:'16px', marginLeft:'8px'}"
            src="../assets/images/navi.png"
            @click="navigate(scope.row.gates)">
        </template>
      </el-table-column>
      <el-table-column align="center" width="130">
        <template #header>
          <p>{{$t('table.status')}}</p>
        </template>
        <template #default="scope">
          <div :style="{width: '100px'}" 
            :class="{'red':scope.row.flightStatus==='CX', 'yellow':scope.row.operationTypeCode==='DEL'}">
            <LoopTextContainer>
              {{scope.row.operationTypeCode === 'DEL' ? scope.row.operationTypeDescription : scope.row.flightStatusDescription || '-'}}
            </LoopTextContainer>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 到达航班 -->
    <el-table 
      v-load-more="123"
      :data="props.data" 
      height="forScroll"
      :empty-text="$t('general.noData')"
      v-else>
      <el-table-column align="center" width="190">
        <template #header>
          <p>{{$t('table.flight')}}</p>
        </template>
        <template #default="scope">
          <div style="height: 30px;">
            <RollUpContainer 
              :list="scope.row.shareList"
              type="flight">
            </RollUpContainer>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="city" align="center" width="250">
        <template #header>
          <p>{{$t('table.from')}}</p>
        </template>
        <template #default="scope">
          <div style="width: 100%; height: 24px;">
            <RollUpContainer 
              :list="scope.row.destsList" 
              type="text">
            </RollUpContainer>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template #header>
          <p>{{$t('table.sched')}}</p>
        </template>
        <template #default="scope">
          <span>
            {{scope.row.scheduleTime ? dayjs(Number(scope.row.scheduleTime)).format('HH:mm') : '-'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template #header>
          <p>{{$t('table.actual')}}</p>
        </template>
        <template #default="scope">
          <span>
            {{scope.row.actualArriveTime ? dayjs(Number(scope.row.actualArriveTime)).format('HH:mm') : '-'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="130">
        <template #header>
          <p>{{$t('table.terminal')}}</p>
        </template>
        <template #default="scope">
          {{scope.row.terminal === 'T1' ? 'T3' : scope.row.terminal}}
        </template>
      </el-table-column>
      <el-table-column prop="operationTypeDescription" align="center" width="130">
        <template #header>
          <p>{{$t('table.status')}}</p>
        </template>
        <template #default="scope">
          <div :style="{width: '180px'}">
            <LoopTextContainer>
              <span :class="{'red':scope.row.flightStatus==='CX', 'yellow':scope.row.operationTypeCode==='DEL'}"
                :style="{lineHeight: '1.5em'}">
                {{scope.row.operationTypeCode === 'DEL' ? scope.row.operationTypeDescription : scope.row.flightStatusDescription || '-'}}
              </span>
            </LoopTextContainer>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { createMsg } from '../utils/message'

const props = defineProps({
  height: {
    type: String,
    default: '100%'
  },
  data: {       // 传递过来一页的航班数据
    type: Array as () => Array<any>,
    required: true
  },
  direction: {  // 1：出发，2：到达
    type: String,
    required: true
  }
})

const emit = defineEmits(['next'])
const nextPage = () => {
  emit('next')
}

// 节流处理timer
let timer: any = null
// 自定义指令 - 给el-table添加滚动事件的监听
const vLoadMore = {
  mounted: (el) => {
    let prevScrollTop = 0
    const tableWrap = el.querySelector('.el-table__body-wrapper')
    tableWrap.addEventListener('scroll', () => {
      // scrollHeight：整个list容器的总高度
      // clientHeight：视窗高度
      // scrollTop：滚动高
      // 在距离页面底部还剩50px的时候加载下一页数据，添加节流处理
      if((tableWrap.scrollHeight - tableWrap.clientHeight - tableWrap.scrollTop) < 50) {
        const currentScrollTop = tableWrap.scrollTop
        if(!timer && (currentScrollTop > prevScrollTop)) {
          timer = setTimeout(() => {
            console.log('next page')
            nextPage()
            timer = null
          }, 500)
        }
      }
      prevScrollTop = tableWrap.scrollTop
    })
  }
}

const route = useRoute()

/**
 * arr: 传入的数组为登机口数组（gates）
 * 跳转到 “准备出发页面” 
 */
const router = useRouter()
const store = useStore()
const { t } = useI18n() 

const navigate = (arr: any[]) => {
  if(arr.length) {
    // 判断登机口对应的点位是否存在
    const markerList = store.state.markerList
    const destName = arr[0].gateNumber
    if(destName in markerList) {
      // 设置登机口作为终点的code
      store.commit('SET_DEST_CODE', destName)
      store.commit('SET_DEST_LABEL', destName)
      router.push('/3-PreAsk')
    }else {
      createMsg('warning', t('tip.gateNotExit'))
    }
  }
}
</script>

<style lang="scss" scoped>
.red{
  background-color: #E22020;
  padding: 5px;
}
.yellow{
  background-color: #FCCF00;
  color: #000;
  padding: 5px;
}
</style>