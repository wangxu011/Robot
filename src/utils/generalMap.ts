import _3U from '../assets/images/airline/3U.png'
import _8L from '../assets/images/airline/8L.png'
import _9C from '../assets/images/airline/9C.png'
import _BK from '../assets/images/airline/BK.png'
import _BR from '../assets/images/airline/BR.png'
import _CA from '../assets/images/airline/CA.png'
import _CX from '../assets/images/airline/CX.png'
import _CZ from '../assets/images/airline/CZ.png'
import _DZ from '../assets/images/airline/DZ.png'
import _EU from '../assets/images/airline/EU.png'
import _FM from '../assets/images/airline/FM.png'
import _G5 from '../assets/images/airline/G5.png'
import _GJ from '../assets/images/airline/GJ.png'
import _GS from '../assets/images/airline/GS.png'
import _GT from '../assets/images/airline/GT.png'
import _HO from '../assets/images/airline/HO.png'
import _HU from '../assets/images/airline/HU.png'
import _HX from '../assets/images/airline/HX.png'
import _JD from '../assets/images/airline/JD.png'
import _JR from '../assets/images/airline/JR.png'
import _KA from '../assets/images/airline/KA.png'
import _KN from '../assets/images/airline/KN.png'
import _KY from '../assets/images/airline/KY.png'
import _MF from '../assets/images/airline/MF.png'
import _MU from '../assets/images/airline/MU.png'
import _NS from '../assets/images/airline/NS.png'
import _NX from '../assets/images/airline/NX.png'
import _OQ from '../assets/images/airline/OQ.png'
import _SC from '../assets/images/airline/SC.png'
import _TV from '../assets/images/airline/TV.png'
import _ZH from '../assets/images/airline/ZH.png'

import _AC from '../assets/images/airline/AC.png'
import _AY from '../assets/images/airline/AY.png'
import _AZ from '../assets/images/airline/AZ.png'
import _BA from '../assets/images/airline/BA.png'
import _ET from '../assets/images/airline/ET.png'
import _JL from '../assets/images/airline/JL.png'
import _KE from '../assets/images/airline/KE.png'
import _KL from '../assets/images/airline/KL.png'
import _LH from '../assets/images/airline/LH.png'
import _MH from '../assets/images/airline/MH.png'
import _NH from '../assets/images/airline/NH.png'
import _NW from '../assets/images/airline/NW.png'
import _OM from '../assets/images/airline/OM.png'
import _OS from '../assets/images/airline/OS.png'
import _OZ from '../assets/images/airline/OZ.png'
import _SK from '../assets/images/airline/SK.png'
import _TG from '../assets/images/airline/TG.png'
import _UA from '../assets/images/airline/UA.png'
import _VN from '../assets/images/airline/VN.png'


/**
 * 航空公司logo对应的map
 */
export const airlineMap = {
  '3U': _3U,
  '8L': _8L,
  '9C': _9C,
  'BK': _BK,
  'BR': _BR,
  'CA': _CA,
  'CX': _CX,
  'CZ': _CZ,
  'DZ': _DZ,
  'EU': _EU,
  'FM': _FM,
  'G5': _G5,
  'GJ': _GJ,
  'GS': _GS,
  'GT': _GT,
  'HO': _HO,
  'HU': _HU,
  'HX': _HX,
  'JD': _JD,
  'JR': _JR,
  'KA': _KA,
  'KN': _KN,
  'KY': _KY,
  'MF': _MF,
  'MU': _MU,
  'NS': _NS,
  'NX': _NX,
  'OQ': _OQ,
  'SC': _SC,
  'TV': _TV,
  'ZH': _ZH,
  'AC': _AC,
  'AY': _AY,
  'AZ': _AZ,
  'BA': _BA,
  'ET': _ET,
  'JL': _JL,
  'KE': _KE,
  'KL': _KL,
  'LH': _LH,
  'MH': _MH,
  'NH': _NH,
  'NW': _NW,
  'OM': _OM,
  'OS': _OS,
  'OZ': _OZ,
  'SK': _SK,
  'TG': _TG,
  'UA': _UA,
  'VN': _VN
}

/**
 * 天气对应的svg图标的iconfont
 * key需要根据后端接口返回值进行修改
 */
export const weatherMap = {
  '多云': '#icon-duoyun',
  '晴天': '#icon-qing',
  '阴天': '#icon-yin',
  '雾': '#icon-wu',
  '雪': '#icon-xue',
  '雨': '#icon-yu'
}

/**
 * 栏目对应的展示模板类型
 */
export const categoryMap = {
  'noGraph': '/NoPicMode',
  'littlePic': '/SmallPicMode',
  'bigPic': '/BigPicMode',
  'composite': '/ComposedMode' // 后端返回组合模式的key待定
}

/**
 * 航班状态对应的map
 */
export const flightStatusMap = {
  'BD': 'flightStatus.bd',
  'LC': 'flightStatus.lc',
  'GC': 'flightStatus.gc',
  'AB': 'flightStatus.ab',
  'CX': 'flightStatus.cx',
  'EX': 'flightStatus.ex',
  'SH': 'flightStatus.sh',
  'OB': 'flightStatus.ob',
  'LD': 'flightStatus.ob',
  'BT': 'flightStatus.bt',
  'OT': 'flightStatus.bt',
  'ES': 'flightStatus.bt',
  'DV': 'flightStatus.dv',
  'CS': 'flightStatus.sh'
}

/**
 * AIUI中跳转对应页面的名字
 */
export const AIUISwitchPageMap = {
  '航班': {
    path: '/flights',
    name: 'aiui.flight'
  },
  '机场地图': {
    path: '/map',
    name: 'aiui.map'
  },
  '购物': {
    path: '/shopping',
    name: 'aiui.shopping'
  },
  '美食': {
    path: '/food',
    name: 'aiui.food'
  },
  '服务设施': {
    path: '/facility',
    name: 'aiui.facility'
  }
}

/**
 * 给机器人发送移动指令时，遇到的异常
 */
export const moveExceptionMap = {
  '-10001': 'tip.doorOpened',
  '-10002': 'tip.robotRunning',
  '-10003': 'tip.locateAtTarget'
}