<template>
  <div id="leaflet_map" ref="mapContainer"></div>
</template>

<script lang="ts" setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import destination from '../assets/images/destination.png'
import locaiton from '../assets/images/location.png'

const store = useStore()

const props = defineProps({
  // 规划路径对应的JSON字符串
  paths: {
    type: String
  }
})

onMounted(() => {
  initMap()
})

// map实例
let map: any = null
// 获取到map对应的div
let mapContainer =  ref() 

// 在store中获取地图相关的属性
const width = store.state.mapInfo?.info.width || config.leaflet.mapWidth
const height = store.state.mapInfo?.info.height || config.leaflet.mapHeight
const originX = store.state.mapInfo?.info.origin_x.toFixed(2) || config.leaflet.originX
const originY = store.state.mapInfo?.info.origin_y.toFixed(2) || config.leaflet.originY
const resolution = store.state.mapInfo?.info.resolution.toFixed(2) || config.leaflet.resolution

const initMap = () => {
  const imageUrl = store.state.leafletImg ? store.state.leafletImg : 'beijing1709.png'
  map = L.map(mapContainer.value, {
    center: [0, 0], 
    minZoom: 4,
    maxZoom: 5,
    zoom: 4,
    attributionControl: false,
    crs: L.CRS.Simple,
    zoomControl: false
  })
  const southWest = map.unproject([0, height], 4)
  const northEast = map.unproject([width, 0], 4)

  const bounds = L.latLngBounds(southWest, northEast)
  L.imageOverlay(imageUrl, bounds).addTo(map)
  map.setMaxBounds(bounds)

  // 获取到终点在机器人坐标系中的坐标
  const destPose = store.state.markerList[store.state.destCode]
  const destCoor = [destPose.pose.position.x, destPose.pose.position.y]
  // const destCoor = [0.64,3.93]  // test data
  const destLeafletCoor = convertToLeaflet(destCoor)
  const icon = createIcon('dest', destination)
  //const icon = createIcon('robot', locaiton) // test location
  
  console.log('drawing dest marker')
  // 绘制终点的marker
  // @ts-ignore
  L.marker(convertPixelToGeo(destLeafletCoor), { icon }).addTo(map)
}

// 监听传递过来的规划路径点的集合
watch(() => props.paths, (val, oldVal) => {
  let paths = []
  if(val && val !== '[]' ) {
    paths = JSON.parse(val)
    console.log('剩余路径点长度：', paths.length)
    // 1、以路径集合的第一个点作为机器人的坐标，绘制机器人marker
    const robotCoor = paths[0]
    // 2、取路径的前两个点，计算斜率，从而确定机器人点位icon的旋转方向
    let theta = Math.atan((paths[1][1] - paths[0][1]) / (paths[1][0] - paths[0][0]))
    if(paths[1][0] - paths[0][0] > 0) {
      theta = Math.PI / 2 - theta
    }else {
      theta = Math.PI * 3 / 2 - theta
    }
    // 3、将弧度转换成角度
    const deg = theta * 180 / Math.PI
    drawRobotMarker(robotCoor, deg)
  }else {
    paths = []
    // 为空，则表示导航已到达终点，将机器人marker坐标设置为终点坐标即可
    const destPose = store.state.markerList[store.state.destCode]
    const destCoor = [destPose.pose.position.x, destPose.pose.position.y]
    drawRobotMarker(destCoor, 0)
  }
  // 绘制规划路径
  drawPaths(paths)
})

let polyline: any = null
const drawPaths = (pointsCoor: number[][]) => {
  let latlngs: any[] = []
  if(pointsCoor.length) {
    latlngs = pointsCoor.map((item: number[]) => {
      const leafletCoor = convertToLeaflet(item)
      const geo = convertPixelToGeo(leafletCoor)
      return geo
    })
    if(!polyline) {
      let path = L.polyline(latlngs, {color: '#00fffc', dashArray: '5', weight: 6})
      path.addTo(map)
      polyline = path
    }else {
      polyline.setLatLngs(latlngs)
    }
    // 以规划路径作为视觉中心
    // map.fitBounds(polyline.getBounds())
  }else {
    latlngs = []
    if(polyline)
      // 将路径清空
      polyline.setLatLngs([])
    // 将终点作为视觉中心
    const destPose = store.state.markerList[store.state.destCode]
    const destCoor = [destPose.pose.position.x, destPose.pose.position.y]
    const destLeafletCoor = convertToLeaflet(destCoor)
    map.setView(convertPixelToGeo(destLeafletCoor))
  }
}

/**
 * 将机器人传入坐标【注：这里的坐标指在激光地图中的坐标】转换成leaflet地图坐标【即图片像素坐标】
 */
const convertToLeaflet = (robotCoor: number[]) => {
  const result: number[] = []
  const newX: number= (robotCoor[0] - originX) / resolution
  const newY: number = height - (robotCoor[1] - originY) / resolution
  result.push(newX)
  result.push(newY)
  return result
}

/**
 * 绘制点位对应的icon
 * @params type: dest：终点icon；robot：机器人icon
 */
const createIcon = (type: string, img: string, theta?: number) => {
  let html = ''
  let iconAnchor: L.PointExpression | null = null
  let className = ''
  // 终点icon
  if(type === 'dest') {
    html = `<div class='icon_img_wrap'>
              <img src=${img} />
            </div>`
    iconAnchor = [30, 70]  // 以底边中点作为点位坐标
    className = 'dest_wrap'
  // 机器人icon
  }else {
    html = `<div class='icon_img_wrap'>
              <img src=${img} style="transform: rotate(${theta}deg)"/>
            </div>`
    iconAnchor = [35, 35]  // 以图片中点作为点位坐标
    className = 'robot_wrap'
  }
  const icon = L.divIcon({
    className,
    html,
    iconAnchor
  })
  return icon
}

/**
 * 将图片上的像素坐标转换成地理坐标，当前zoom设置为4，可根据情况调整
 */
const convertPixelToGeo = (array: number[]) => {
  let resultArr: any[] = []
  resultArr.push(map.unproject(array, 4).lat)
  resultArr.push(map.unproject(array, 4).lng)
  return resultArr
}

/**
 * // 定义机器人marker接收变量，若存在则更新位置，否则新增
 * @param arr 点的坐标
 * @param theta icon对应图片的旋转角度【注：不是弧度】
 */
let robotMarker: any = null  
const drawRobotMarker = (arr: number[], theta: number) => {
  const leafletCoor = convertToLeaflet(arr)
  const icon = createIcon('robot', locaiton, theta)
  const geoCoor = convertPixelToGeo(leafletCoor)
  if(!robotMarker) {
    // @ts-ignore
    const marker = L.marker(geoCoor, { icon, zIndexOffset: 10 })
    marker.addTo(map)
    // 以机器人坐标作为视觉中心
    map.setView(geoCoor)
    robotMarker = marker
  }else {
    robotMarker.setIcon(icon)
    robotMarker.setLatLng(geoCoor)
    map.setView(geoCoor)
  }
}
</script>

<style lang="scss" scoped>
#leaflet_map{
  height: 100%;
}
</style>