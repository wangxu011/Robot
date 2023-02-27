<template>
  <div id="layer_container">
    <div id="map_container" ref="mapContainer"></div>
    <div class="btns_wrap">
      <!-- 复位地图方向 -->
      <div class="reset_orientation" @click="resetOrientation">
        <img src="../assets/images/compass.png" />
      </div>
      <!-- 楼层切换组件 -->
      <div class="floor_wrap">
        <div 
          class="floor_item" 
          v-for="(floor, key) in floorMap"
          :key="key"
          :class="{'selected':selectedFloor.layer === floor}"
          @click="switchFloor(floor, String(key))">
          {{key}}
        </div>
      </div>
      <!-- 复位视图中心 -->
      <div class="reset_orientation" style="bottom: 113px;" @click="resetViewCenter">
        <el-icon :size="45" color="#00DDC9">
          <aim />
        </el-icon>
      </div>
    </div>
    <!-- 搜索框 -->
    <div class="input_wrap">
      <el-input
        v-model="key"
        :placeholder="$t('map.input')"
        @input="inputChange">
      </el-input>
      <div class="list_wrap" v-if="showResult">
        <p class="item" 
          @click="selectItem(place)"
          v-for="place in places" 
          :key="place">
          {{place.name}}
        </p>
        <p class="no_data" v-if="!places.length">{{$t('map.noData')}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createMsg } from '../utils/message'
import { ElLoading } from 'element-plus'

import { _getToken, _getTestToken, _planRoute, _queryByPosition, _queryByName, _queryByCode } from '../axios/api/hzController'

import originIcon from '../assets/images/origin.png'
import destinationIcon from '../assets/images/destination.png'
import location from '../assets/images/location.png'

// ol全局样式所在路径
import 'ol/src/ol.css'

// 地图基础元素
import Map from 'ol/Map'
import View from 'ol/View'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import { Vector as SourceVector} from 'ol/source'
import { Vector as LayerVector } from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'

// 几何地理元素
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import { Style, Icon, Stroke, Fill, Text } from 'ol/style'

const { t } = useI18n()

const store = useStore()
let map: any = null

const props = defineProps({
  poiId: {    // 传入的点位poiId
    type: String,
    required: false
  },
  name: {   // 传入点位的名称：如登机口名称：B20
    type: String,
    required: false
  },
  floor: {  // 传入点位所在楼层
    type: String,
    required: false
  }
})

// 终点坐标
const dest: any = reactive({
  pos: [],
  name: '',
  floor: ''
})

// 规划路径的距离，预估时间 = 路径 / 1.5m/s
const distance = ref(0)

/**
 * 楼层相关逻辑
 */
const floorMap: any = {
  'F5': 'hgh:t4_shinei_f5',
  'F4': 'hgh:t4_shinei_f4',
  'F3': 'hgh:t4_shinei_f3',
  'F2': 'hgh:t4_shinei_f2',
  'F1': 'hgh:t4_shinei_f1',
  'B1': 'hgh:t4_shinei_b1',
  'B2': 'hgh:t4_shinei_b2',
}

const selectedFloor = reactive({
  name: '',
  layer: ''
})

const switchFloor = (layer: string, name: string) => {
  selectedFloor.name = name
  selectedFloor.layer = layer
  // 清空终点destPointLayer
  if(destPointLayer) {
    destPointLayer.getSource().clear()  // 删除点的信息
    map.removeLayer(destPointLayer)     // 将点对应的图层从map容器中移除
    destPointLayer = null               // 将对应图层置空
  }
  // 清空highLightLayer
  if(highLightLayer) {
    highLightLayer.getSource().clear()
    map.removeLayer(highLightLayer)
    highLightLayer = null
  }
  // 图层切换
  source.updateParams({layers: layer})
}

/**
 * 搜索框相关逻辑
 */
const showResult = ref(false)  // 是否显示搜索结果列表
const places: any = ref([])
const key = ref('')
let timer: any = null
const inputChange = (e: string) => {
  if(timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    // 调用接口传入key.value，模糊查询相关店铺列表
    _queryByName(key.value).then((res: any) => {
      places.value = res.data
      showResult.value = true
    })
  }, 600)
}

const selectItem = (item: any) => {
  // 获取选择的点所在楼层，进行楼层的切换
  const f: any = item.floor.toUpperCase()
  switchFloor(floorMap[f], f)

  view.setCenter([item.lon, item.lat])
  addPoint([item.lon, item.lat], map, item.name)
  // 绘制高亮
  drawHighLight(item.geom)
  dest.name = item.name
  dest.pos = [item.lon, item.lat]
  dest.floor = f
  showResult.value = false
}

/**
 * 【起点 / 终点】顶部提示框相关逻辑
 */
const showTip = ref(false)

/**
 * 底部提示框
 */
const bottomFlag = ref(false)

// 获取mapContainer对应的DOM元素
let mapContainer =  ref<HTMLElement | null>(null)

// 将view设置为全局变量，方便设置视图中心
let view: any = null

// 将source变量设置在全局作用域，方便后面切换楼层图层
let source: any = null

// 设置视觉中心坐标
let center: any = [120.42628740115443, 30.23628709753917]

onMounted(async () => {
  // 全局添加点击事件，隐藏搜索列表
  window.addEventListener('click', () => {
    showResult.value = false
  })
  // 在初始化时，先将map容器内容置空，以防production版本中出现两个canvas的问题
  if(mapContainer.value)
    mapContainer.value.innerHTML = ''

  // 默认楼层设置为F2
  selectedFloor.name = 'F2'
  selectedFloor.layer = floorMap['F2']

  // 设置区域的左上角、右下角点的坐标作为extent坐标
  const maxExtent = boundingExtent([
    [120.41878184560372, 30.242242088393308], [120.43205886165826, 30.23119975843494]
  ])

  view = new View({
    extent: transformExtent(maxExtent, 'EPSG:4326', 'EPSG:4326'),
    projection: 'EPSG:4326',
    // 使用默认视觉中心
    center,
    zoom: 19 // 适用于真实环境
  })

  // 获取渲染地图所需的token
  const tokenRes = await _getToken()
  console.log('dmz token res: ', tokenRes)

  let mapUrl = ''
  if(window.location.hostname.startsWith('10.235')) {
    mapUrl = `http://${config.hz.mapHost}/gateway/UniServer/hgh/wms?service=WMS&token=${tokenRes.data}`
  }else {
    mapUrl = `https://wap.hzairport.com/gateway/UniServer/hgh/wms?service=WMS&token=${tokenRes.data}`
  }
  source = new TileWMS({
    // 先用DMZ区域的进行测试
    url: mapUrl,
    params: {
      layers: selectedFloor.layer
    }
  })
  const layers = [
    new TileLayer({
      // WMS（Web Map Service）图层
      source
    })
  ]
  map = new Map({
    target: 'map_container',
    view,
    layers
  })

  /**
   * 地图相关操作
   */
  // 1、绑定点击事件 -> 根据点击地图中点的坐标，调用接口获取对应的点位信息
  map.on('singleclick', async (e: any) => {
    const res = await _queryByPosition(selectedFloor.name.toLowerCase(), e.coordinate[0], e.coordinate[1])
    console.log('Point res: ', res)
    if(res.data.length) {
      // if(!bottomFlag.value) bottomFlag.value = true
      const data = res.data[0]
      dest.name = data.name
      dest.pos = [data.lon, data.lat]
      dest.floor = data.code.substring(0, 2).toLowerCase()
      addPoint([data.lon, data.lat], map, data.name)
      // 绘制高亮
      drawHighLight(data.geom)
    }else {
      createMsg('warning', t('map.noShop'))
    }
  })

  // 3、判断props.name是否存在【登机口 / 值机柜台】，若存在，调用_queryByName查询
  if(props.name) {
    const loading = ElLoading.service({
      lock: true,
      text: t('general.calculate'),
      background: 'rgba(10, 10, 10, .5)',
      customClass: 'call_robot_32'
    })
    _queryByName(props.name).then(async res => {
      console.log('query by props name res: ', res.data)
      if(res.data && res.data.length) {
        // 过滤出所有登机口点位的list，对应的type值为1107
        const gateList = res.data.filter(item => item.type == '1107')
        const posInfo = gateList[0]
        dest.name = posInfo.name
        dest.pos = [posInfo.lon, posInfo.lat]
        dest.floor = posInfo.code.substring(0, 2).toLowerCase()
        addPoint([posInfo.lon, posInfo.lat], map, posInfo.name)
        // 绘制高亮
        drawHighLight(posInfo.geom)
        view.setCenter([posInfo.lon, posInfo.lat])
      }else {
        createMsg('warning', t('map.noShop'))
      }
    }).finally(() => {
      loading.close()
    })
  }
})

watch(() => props.poiId, (val, oldVal) => {
  if(val) {
    console.log('select shop, poiId: ', val)
    _queryByCode(val).then(res => {
      console.log('get by poiId res: ', res)
      if(res.data) {
        const posInfo = res.data
        selectItem(posInfo)
      }else {
        createMsg('warning', t('map.noShop'))
      }
    })
  }
})



/**
 * 打点函数
 * @param lnglat [经度, 纬度]
 * @param map 地图对象实例
 */
let destPointLayer: any = null
const addPoint = (lnglat: number[], map: Map, name?: string) => {
  // 创建矢量资源容器
  let sourceVector = new SourceVector({})
  // 获取坐标特征
  const feature = createPointFeature(lnglat)
  sourceVector.addFeature(feature)

  // 创建打点样式
  const iconStyle = new Style({
    image: new Icon({
      scale: 0.8, // 控制icon图片的缩放比例
      opacity: 0.95,
      src: destinationIcon,
      // 设置图片的偏移，以icon的底边中心作为点位坐标
      anchor: [40, 81],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
    }),
    // 写文字
    text: new Text({
      textAlign: 'center',
      text: name,
      offsetY: -90,
      font: 'bold 40px 华康黑体W5-A',
      fill: new Fill({
        color: '#404044'
      })
    })
  })
  // 如若存在，则先删除
  if(destPointLayer) {
    destPointLayer.getSource().clear()  // 删除点的信息
    map.removeLayer(destPointLayer)     // 将点对应的图层从map容器中移除
    destPointLayer = null               // 将对应图层置空
  }
  destPointLayer = new LayerVector({
    source: sourceVector,
    style: iconStyle,
    zIndex: 2
  })
  map.addLayer(destPointLayer)
}

let highLightLayer: any = null
const drawHighLight = (geoJson: any) => {
  let sourceVector = new SourceVector({
    features: new GeoJSON().readFeatures(geoJson)
  })
  const lineStyle = new Style({
    // 线的样式
    stroke: new Stroke({
      color: 'orange',
      width: 2,
    }),
    // 填充颜色
    fill: new Fill({
      color: 'pink'
    })
  })
  if(highLightLayer) {
    highLightLayer.getSource().clear()  // 删除高亮区资源
    map.removeLayer(highLightLayer)     // 将高亮区图层从map容器中移除
    highLightLayer = null               // 将对应高亮区图层置空
  }
  // 创建矢量图层
  highLightLayer = new LayerVector({
    source: sourceVector,
    style: lineStyle
  })
  map.addLayer(highLightLayer)
}

const createPointFeature = (lnglat: number[]) => {
  return new Feature({
    geometry: new Point(lnglat, 'XY')
  })
}

// 复位地图旋转方向
const resetOrientation = () => {
  view.setRotation(0)
}

// 复位地图视图中心与楼层，即回到 “我的位置”
const resetViewCenter = () => {
  view.setCenter(center)
  switchFloor(floorMap['F2'], 'F2')
}
</script>

<style lang="scss" scoped>
#layer_container{
  height: 100%;
  position: relative;
  #map_container{
    height: 100%;
  }
  .btns_wrap{
    position: absolute;
    left: 20px;
    bottom: 175px;
    .reset_orientation{
      width: 76px;    
      height: 76px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0px 5px 9px 1px rgba(0, 0, 0, 0.22);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .floor_wrap{
      z-index: 99;
      background-color: #fff;
      border-radius: 40px;
      box-shadow: 0px 5px 9px 1px rgba(0, 0, 0, 0.22);
      padding: 10px;
      padding-bottom: 16px;
      margin: 13px 0;
      .floor_item{
        width: 60px;
        height: 60px;
        border-radius: 30px;
        line-height: 60px;
        font-size: 30px;
        font-family: 'Univers';
        margin-top: 8px;
        background-color: #eee;
        color: #00DDC9;
      }
      .selected{
        background-color: #00DDC9;
        color: #fff;
      }
    }
  }
  :deep(.input_wrap){
    // width: 100%; 
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    .el-input{
      .el-input__inner{
        height: 70px;
        line-height: 70px;
        font-size: 32px;
        border-radius: 10px;
        border: 1px solid #aaa;
        text-align: center;
      }
    }
    .list_wrap{
      height: 600px;
      border-radius: 10px;
      background-color: #fff;
      border: 1px solid #aaa;
      margin-top: 5px;
      padding: 20px;
      overflow-y: scroll;
      .item{
        line-height: 70px;
        font-size: 30px;
        border-bottom: 1px solid #ccc;
      }
      .no_data{
        line-height: 558px;
        font-size: 30px;
      }
    }
  }
  .tip_wrap{
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #aaa;
    display: flex;
    align-items: center;
    padding: 25px 35px;
    .img_wrap{
      margin: 0 15px;
    }
    .right_part{
      width: calc(100% - 115px);
      margin-left: 20px;
      .origin, .dest{
        font-size: 30px;
        text-align: left;
        padding-left: 20px;
      }
      .line{
        border-top: 1px solid #aaa;
        margin: 20px 0;
      }
    }
  }
  .bottom_window_wrap{
    width: 92%;
    height: 120px;
    position: absolute;
    left: 4%;
    bottom: 30px;
    border-radius: 20px;
    background-color: #fff;
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.09);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    .dest_name{
      font-size: 35px;
    }
    .go{
      width: 140px;
      height: 140px;
      line-height: 140px;
      border-radius: 70px;
      background-color: #06CED1;
      font-size: 36px;
      color: #fff;
      margin-bottom: 90px;
    }
    .virtual_navigate{
      padding: 16px 36px;
      font-size: 34px;
      background-color: #084aa6;
      color: #fff;
      border-radius: 33px;
    }
    .disabled{
      pointer-events: none;
      cursor: default;
      opacity: .4;
    }
  }
}
</style>