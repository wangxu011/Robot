import { createStore } from 'vuex'

import Socket from '../webSocket'

const store = createStore({
  state() {
    return {
      AIUIState: 1,        // AIUI状态：1：IDLE，2：READY，3：WORKING
      AIUIPlaying: false,  // AIUI是否正在播放语音
      faceImage: '',       // 刷脸搜索的图片
      destLabel: '',       // 目的地点位的显示文本【点位的命名规则：中文名称_poiID_英文名称】
      destCode: '',        // 目的地对应的点位code
      secret: '',          // 开箱密码,
      verifyImage: '',     // 人脸验证开箱的底图
      snapshotImage: '',   // 验证开箱时的抓拍图
      robotStatus: {},   // 机器人状态 
      markerList: null,    // 机器人点位列表
      mapInfo: null,       // 地图相关信息
      searchRes: {},       // 刷脸比对结果
      robotConfig: {},     // 机器人全局配置
      leafletImg: '',       // leaflet地图背景图路径
      cameraWS: null,       // 连接相机回显程序的webSocket实例
      cameraBizWS: null     // 与相机程序交互的webSocket实例
    }
  },
  mutations: {
    SET_AIUI_STATE(state: any, robotState: number) {
      state.robotState = robotState
    },
    SET_AIUI_PLAYING(state: any, status: boolean) {
      state.AIUIPlaying = status
    },
    SET_FACE_IMAGE(state: any, image: object) {
      state.faceImage = image
    },
    SET_DEST_LABEL(state: any, label: string) {
      state.destLabel = label
    },
    SET_DEST_CODE(state: any, code: string) {
      state.destCode = code
    },
    SET_SECRET(state: any, secret: string) {
      state.secret = secret
    },
    SET_VERIFY_IMAGE(state: any, image: string) {
      state.verifyImage = image
    },
    SET_SNAPSHOT_IMAGE(state: any, image: string) {
      state.snapshotImage = image
    },
    SET_ROBOT_STATUS(state: any, status: object) {
      state.robotStatus = status
    },
    SET_MARKER_LIST(state: any, list: object) {
      state.markerList = list
    },
    SET_MAP_INFO(state: any, info: object) {
      state.mapInfo = info
    },
    SET_SEARCH_RES(state: any, res: object) {
      state.searchRes = res
    },
    SET_ROBOT_CONFIG(state: any, config: object) {
      state.robotConfig = config
    },
    SET_LEAFLET_IMG(state: any, img: string) {
      state.leafletImg = img
    },
    SET_CAMERA_WS(state: any, val: Socket) {
      state.cameraWS = val
    },
    SET_CAMERA_BIZ_WS(state: any, val: Socket) {
      state.cameraBizWS = val
    }
  }
})

export default store