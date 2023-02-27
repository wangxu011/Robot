/**
 * TODO - 待实现
 * 客户端告知检测到陌生人
 * @param fn
 */
export const greetStranger = (fn: Function) => {
  baseFunc('greetStranger', fn)
}

/**
 * 客户端告知机器人处于唤醒状态
 * @param fn
 */
export const AIUIState = (fn: Function) => {
  baseFunc('AIUIState', fn)
}

/**
 * 客户端告知识别的语音对应的文字
 * @param fn
 */
export const AIUIDataEvent = (fn: Function) => {
  baseFunc('AIUIDataEvent', fn)
}

/**
 * 移除AIUI监听
 * @param fn 
 */
export const removeAIUIDataEvent = () => {
  removeBaseFunc('AIUIDataEvent')
}

/**
 * 监听设备侧返回舱门的状态
 * @param fn 
 */
export const openDoor = (fn: Function) => {
  baseFunc('openDoor', fn)
}

/**
 * 移除openDoor监听
 */
 export const removeOpenDoor = () => {
  removeBaseFunc('openDoor')
}

/**
 * 机器人旋转完毕后发送信号
 * @param fn 
 */
export const robotRotate180 = (fn: Function) => {
  baseFunc('robotRotate180', fn)
}

/**
 * 移除机器人旋转监听
 */
export const removeRobotRotate180 = () => {
  removeBaseFunc('robotRotate180')
}

/**
 * 监听客户端返回的实时剩余路径集合
 * @param fn 
 */
export const getPlanPath = (fn: Function) => {
  baseFunc('getPlanPath', fn)
}

export const removeGetPlanPath = () => {
  removeBaseFunc('getPlanPath')
}

/**
 * 监听机器人实时状态【客户端每隔 1 秒上报一次】
 * @param fn 
 */
export const robotStatus = (fn: Function) => {
  baseFunc('robotStatus', fn)
}

/**
 * 接收客户端返回的所有点位列表
 * @param fn 
 */
export const getMarkerList = (fn: Function) => {
  baseFunc('getMarkerList', fn)
}

/**
 * 获取机器人当前地图信息
 * @param fn 
 */
export const getCurrentMapInfo = (fn: Function) => {
  baseFunc('getCurrentMapInfo', fn)
}

/**
 * 获取机器人全局配置
 * @param fn 
 */
export const setWebUiConfig = (fn: Function) => {
  baseFunc('setWebUiConfig', fn)
}

/**
 * 接收机器人导航过程中的异常通知
 * @param fn 
 */
export const robotNotice = (fn: Function) => {
  baseFunc('robotNotice', fn)
}

/**
 * 移除异常通知监听
 */
export const removeRobotNotice = () => {
  removeBaseFunc('robotNotice')
}

/**
 * 接收召唤指令
 * @param fn 
 */
export const callRobot = (fn: Function) => {
  baseFunc('callRobot', fn)
}

/**
 * 移除监听召唤指令
 */
export const removeCallRobot = () => {
  removeBaseFunc('callRobot')
}
/******************* 基础函数封装 *******************/
/**
 * 移除监听函数
 * @param funcName
 */
const removeBaseFunc = (funcName: string) => {
  if(window.cefMethods[funcName])
    window.cefMethods[funcName] = null
}

/**
 * 与原生cef对接：直接把方法挂载到window对象上的自定义属性：cefMethods
 */
const baseFunc = (funcName: string, callBackFn?: Function) => {
  if(!window.cefMethods) {
    // 初始化 cefMethods 对象
    window.cefMethods = {}
  }
  // 初始化供 C++ 侧调用的函数
  if(!window.cefMethods[funcName]) {
    window.cefMethods[funcName] = (res: string) => {
      console.log(`recieve: ${funcName} res: `, res)
      if(callBackFn) {
        try {
          const resObj = JSON.parse(res)
          callBackFn(resObj)
          // 只把 request 类型的调用给出返回
          if(resObj.type === 'request') {
            // 收到结果后，再返回一个结果给 C++
            sendMsgToC('response', funcName)
          }
        }catch(err) {
          console.log('error happened.........')
          console.log('err: ', err)
          // 返回错误给 C++
          sendMsgToC('error', funcName)
        }
      }
    }
  }
}

/**
 * 回传给 C++ 响应结构体
 * @param type 
 * @param method 
 */
const sendMsgToC = (type: string, method: string) => {
  if(window.cefQuery) {
    let body = {}
    if(type === 'error') {
      body = {
        'code': -1,
        'message': 'parse JSON occurs error'
      }
    }
    window.cefQuery({
      request: JSON.stringify({
        type,
        method,
        body
      }),
      onSuccess: (res) => {},
      onFailure: (err) => {}
    })
  }
}