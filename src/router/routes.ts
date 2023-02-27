export default [
  // 首页
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  // 语音识别页面
  {
    path: '/voice',
    name: 'Voice',
    component: () => import('../pages/Voice.vue')
  },
  // 找登机口
  {
    path: '/scanFace',
    name: 'ScanFace',
    component: () => import('../pages/ScanFace.vue')
  },
  // 机场地图
  {
    path: '/map',
    name: 'Map',
    component: () => import('../pages/Map.vue')
  },
  // 美食
  {
    path: '/food',
    name: 'Food',
    component: () => import('../pages/Food.vue')
  },
  {
    path: '/shopping',
    name: 'Shopping',
    component: () => import('../pages/Shopping.vue')
  },
  // 动态航班
  {
    path: '/flights',
    name: 'Flight',
    component: () => import('../pages/Flight.vue')
  },
  // 服务设施
  {
    path: '/facility',
    name: 'Facility',
    component: () => import('../pages/Facility.vue')
  },
  // 充电中
  {
    path: '/charging',
    name: 'Charging',
    component: () => import('../pages/Charging.vue')
  },
  // 急停页面
  {
    path: '/estop',
    name: 'Estop',
    component: () => import('../pages/Estop.vue')
  },
  // 召唤页面
  {
    path: '/call',
    name: 'Call',
    component: () => import('../pages/Call.vue')
  },
  // 工程页面
  {
    path: '/project',
    name: 'Project',
    component: () => import('../pages/Project.vue')
  },
  // 开门失败页面
  {
    path: '/openDoorFailed',
    name: 'OpenDoorFailed',
    component: () => import('../pages/OpenDoorFailed.vue')
  },
  /* 四种栏目展示模板：无图 / 小图 / 大图 / 组合 */
  {
    path: '/NoPicMode',
    name: 'NoPicMode',
    component: () => import('../pages/categoryTemplate/NoPicMode.vue')
  },
  {
    path: '/SmallPicMode',
    name: 'SmallPicMode',
    component: () => import('../pages/categoryTemplate/SmallPicMode.vue')
  },
  {
    path: '/BigPicMode',
    name: 'BigPicMode',
    component: () => import('../pages/categoryTemplate/BigPicMode.vue')
  },
  {
    path: '/ComposedMode',
    name: 'ComposedMode',
    component: () => import('../pages/categoryTemplate/ComposedMode.vue')
  },
  /* 导航流程相关页面 */
  {
    path: '/mismatch', // 未比中后显示航班列表
    name: 'Mismatch',
    component: () => import('../pages/Mismatch.vue')
  },
  {
    path: '/2-FlightInfo', // 比中后显示航班信息页面
    name: '2FlightInfo',
    component: () => import('../pages/navigation/2-FlightInfo.vue')
  },
  {
    path: '/3-PreAsk',   // 询问是否需要机器人帮拿行李
    name: '3PreAsk',
    component: () => import('../pages/navigation/3-PreAsk.vue')
  },
  {
    path: '/4-SetPassword',   // 设置开箱密码
    name: '4SetPassword',
    component: () => import('../pages/navigation/4-SetPassword.vue')
  },
  {
    path: '/5-OpeningDoor',   // 正在开门
    name: '5OpeningDoor',
    component: () => import('../pages/navigation/5-OpeningDoor.vue')
  },
  {
    path: '/6-PutPackage',   // 放置行李
    name: '6PutPackage',
    component: () => import('../pages/navigation/6-PutPackage.vue')
  },
  {
    path: '/7-CheckPackage',   // 检查行李已放好
    name: '7CheckPackage',
    component: () => import('../pages/navigation/7-CheckPackage.vue')
  },
  {
    path: '/8-PlanRoute',   // 路径规划中
    name: '8PlanRoute',
    component: () => import('../pages/navigation/8-PlanRoute.vue')
  },
  {
    path: '/9-StartNavigate',   // 开始导航
    name: '9StartNavigate',
    component: () => import('../pages/navigation/9-StartNavigate.vue')
  },
  {
    path: '/10-VerifyFace',   // 核验人脸
    name: '10VerifyFace',
    component: () => import('../pages/navigation/10-VerifyFace.vue')
  },
  {
    path: '/11-VerifySuccess',   // 核验成功
    name: '11VerifySuccess',
    component: () => import('../pages/navigation/11-VerifySuccess.vue')
  },
  {
    path: '/12-VerifyFailed',   // 核验失败
    name: '12VerifyFailed',
    component: () => import('../pages/navigation/12-VerifyFailed.vue')
  },
  {
    path: '/13-PasswordValidation',   // 密码验证
    name: '13PasswordValidation',
    component: () => import('../pages/navigation/13-PasswordValidation.vue')
  },
  {
    path: '/14-ThanksForUse',   // 感谢使用，下次再见
    name: '14ThanksForUse',
    component: () => import('../pages/navigation/14-ThanksForUse.vue')
  },
  {
    path: '/15-TurnBack',   // 正常返航
    name: '15TurnBack',
    component: () => import('../pages/navigation/15-TurnBack.vue')
  },
  {
    path: '/16-GoCharging',   // 去充电
    name: '16GoCharging',
    component: () => import('../pages/navigation/16-GoCharging.vue')
  }
]