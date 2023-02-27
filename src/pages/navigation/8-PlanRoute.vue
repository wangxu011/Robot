<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <PlanRoute></PlanRoute>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
import { ifImageExist } from '../../utils/tools'

const router = useRouter()
const { t } = useI18n()
const title = t('tip.planRoute')

onMounted(() => {
  // 倒计时5S后，跳转到 /9-StartNavigate
  setTimeout(() => {
    // 获取即将要渲染的地图，因为验证地图是否存在需要一段时间，所以放在这个倒计时的空闲进行处理
    getRenderImage()
    router.push('/9-StartNavigate')
  }, 5000)
})

const store = useStore()
const getRenderImage = async () => {
  const start = new Date().getTime()
  let imageUrl = ''
  if(store.state.mapInfo?.map_name) {
    // 约定的机器人美化地图名称：地图_楼层_Beautiful.png
    const mapName = store.state.mapInfo?.map_name
    const floor = store.state.mapInfo?.floor
    // 1、先判断美化地图是否存在
    const ifBeatifulImgRes = await ifImageExist(`${mapName}_${floor}_Beautiful.png?time=${new Date().getTime()}`)
    console.log('ifBeatifulImgRes: ', ifBeatifulImgRes)
    if(ifBeatifulImgRes) {
      imageUrl = `${mapName}_${floor}_Beautiful.png`
    }else {
      // 2、判断原始激光地图是否存在
      const ifLaserImgRes = await ifImageExist(`http://192.168.10.10:8809/maps/${mapName}/${floor}/map.png`)
      console.log('ifLaserImgRes: ', ifLaserImgRes)
      if(ifLaserImgRes) {
        imageUrl = `http://192.168.10.10:8809/maps/${mapName}/${floor}/map.png`
      }else {
        imageUrl = 'beijing1709.png'
      }
    }
  }else {
    imageUrl = 'beijing1709.png'
  }
  const end = new Date().getTime()
  console.log('cost time: ', (end - start) / 1000)
  store.commit('SET_LEAFLET_IMG', imageUrl)
}
</script>

<style lang="scss" scoped>

</style>