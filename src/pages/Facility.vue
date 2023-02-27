<template>
  <SubLayout>
    <div class="facility_container">
      <div class="input_wrap">  
        <el-input v-model="inputDest"
          :prefix-icon="Search"
          :placeholder="$t('subPage.facility.placeholder')"
          @input="search">
        </el-input>
      </div>
      <div class="list_wrap">
        <div class="no_data" v-if="!showList.length">{{$t('general.noData')}}</div>
        <el-scrollbar v-else>
          <div class="dest_item_wrap"
            :key="item.code"
            v-for="item in showList">
            <div class="name">{{item.label}}</div>
            <div class="distance">{{item.distance}}{{$t('general.meter')}}</div>
            <div class="go_wrap" @click="navigate(item.code, item.label)">
              <img src="../assets/images/go_there.png" />
              <span>{{$t('map.go')}}</span>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </SubLayout>
</template>

<script lang="ts" setup>
import { getDistance } from '../utils/tools'

import { Search } from '@element-plus/icons'

const store = useStore()

const { locale } = useI18n()

type markerItem = {
  label: string,
  code: string,
  distance: number
}

const list = ref<markerItem[]>([])
// 用于页面中的展示列表
const showList = ref<markerItem[]>([])

onMounted(() => {
  // 1、获取机器人当前所在位置，在store中存储
  let currentPos = [0, 0]
  if(store.state.robotStatus) {
    console.log('robotStatus: ', store.state.robotStatus)
    currentPos = [store.state.robotStatus.current_pose.x, store.state.robotStatus.current_pose.y]
  }
  // 2、处理点位列表，将对象转换成数组
  if(store.state.markerList) {
    // 将点位列表进行过滤，只保留对应的key是以 "12" 开头的点位【注：服务设施的点位均以12开头】
    const unsortedList = Object.values(store.state.markerList).filter((markerVal: any) => String(markerVal.key).startsWith('12')).map((item: any) => {
      // 计算出每个点位与机器人当前位置的距离
      const x = item.pose.position.x
      const y = item.pose.position.y
      const distance = getDistance(currentPos, [x, y])
      // marker_name格式：中文名称_poiID_英文名称
      const nameArr = item.marker_name.split('_')
      let label = ''
      // 如果分割的数组长度为3，则代表点位有英文名称
      if(nameArr.length === 3) {
        // 判断多语言类型
        label = locale.value === 'CN' ? nameArr[0] : nameArr[2]
      }else {
        // 只显示中文即可
        label = nameArr[0]
      }
      return {
        label,
        code: item.marker_name,
        distance
      }
    })
    // 根据距离按升序进行排列
    list.value = unsortedList.sort((a, b) => a.distance - b.distance)
    showList.value = list.value
  }
})

const inputDest = ref('')

let timer: NodeJS.Timeout | null = null
const search = (e: string) => {
  if(timer)
    clearTimeout(timer)
  timer = setTimeout(() => {
    // 模糊查询List
    showList.value = list.value.filter((item) => item.code.indexOf(e) !== -1)
  }, 300)
}

const router = useRouter()
const navigate = (code: string, label: string) => {
  store.commit('SET_DEST_CODE', code)
  store.commit('SET_DEST_LABEL', label)
  router.push('/3-PreAsk')
}
</script>

<style lang="scss" scoped>
.facility_container{
  height: 100%;
  :deep(.input_wrap){
    .el-input{
      .el-input__inner{
        height: 90px;
        line-height: 90px;
        font-size: 35px;
        border: none;
        border-bottom: 4px solid;
        border-image: linear-gradient(31deg, rgba(4, 218, 170, 0.81), rgba(84, 251, 251, 0.81)) 1 1 1;
        background-color: transparent;
        text-align: left;
        color: #6A6A6A;
        padding-left: 120px;
      }
      .el-input__inner::-webkit-input-placeholder{
        color: #6A6A6A;
      }
      .el-input__prefix{
        color: #33E1BA;
        left: 50px;
        top: 20px;
        .el-icon{
          font-size: 43px;
        }
      }
    }
  }
  .list_wrap{
    height: calc(100% - 150px);
    .no_data{
      height: 100%;
      font-size: 35px;
      color: #6A6A6A;
      line-height: 40em;
    }
    .dest_item_wrap{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 60px;
      padding: 0 120px;
      .name{
        width: 32%;
        color: #fff;
        font-size: 35px;
        text-align: left;
      }
      .distance{
        width: 100px;
        color: #33E1BA;
        font-size: 25px;
        text-align: left;
      }
      .go_wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 2px solid #33E1BA;
        width: auto;
        height: 54px;
        border-radius: 27px;
        padding: 0 20px;
        background: #333334;
        span{
          font-size: 25px;
          color: #fff;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>