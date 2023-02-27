const config = {
  // 激光地图相关配置【已经弃用，都由客户端进行上报】
  // leaflet: {
  //   mapWidth: 932,
  //   mapHeight: 1385,
  //   originX: -14.96,
  //   originY: -25.8,
  //   resolution: 0.03,
  //   mapPath: 'beijing1709.png'
  // },
  // 杭州地图
  leaflet: {
    mapWidth: 14059,
    mapHeight: 6553,
    originX: -14.96,
    originY: -25.8,
    resolution: 0.05,
    mapPath: 'hangzhou.png'
  },
  // 智慧图所需相关配置
  rtMap: {
    buildId: "862700010070100002", // 杭州萧山
    key: "k7i23869hd", // 杭州萧山
    resources: "/rtMap/resources/", // 智慧图资源地址
    floor: "F3", // 智慧图显示默认楼层
    mapZoom: 0.3, // 智慧图默认层级，数字越小，显示越大
    labelDensity: 2, // 智慧图 店铺名称显示密集度
    pitch: 1, // 倾斜度 0-1  为0是地图禁止翻转
    originName: "B20登机口" // 预设航显所在位置
  },
  // 合众思壮所需配置
  hz: {
    // mapHost: '106.38.108.70:18994',  // 地图服务对应的域（测试）
    // apiHost: '106.38.108.70:18993',  // 接口对应的域（测试）
    // orgaFlag: '66',                  // 获取token接口需要的参数（先上报机器ip地址，然后由机场方生成对应值）
    // orgaKey: 'Nh0jpk/wnNcXVWr8FM9ucQ=='  // 同上
    mapHost: '10.235.66.17:8088',  // 地图服务对应的域（机场线上）
    apiHost: '10.235.66.17:18110',  // 获取接口对应的域（机场线上），获取token的服务器对应的端口是9200
    orgaFlag: '77',                // Flag（机场线上）
    orgaKey: 'e/Gl/g9C7msP6IqHwrQk3Q=='  // Key（机场线上）
  },
  // webSocket配置
  ws: {
    // 视频回显
    camera: 'ws://localhost:30013/Algorithm/Camera/Video',
    // 摄像头其他业务逻辑
    cameraBiz: 'ws://localhost:30013/Algorithm/Camera/Control'
  },
  returnHomeTimeout: 30       // 无操作时，自动返回首页的超时时间【单位：秒】
}