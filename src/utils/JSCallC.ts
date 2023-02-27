/**
 * 告知客户端当前程序处于哪个页面
 * @param business | 当前页面代表的业务模块
 * @param status | 机器人当前状态；1：繁忙，0：空闲【当前在 "首页" 和 "15TurnBack" 表示机器人空闲】
 */
export const currentStatus = (business: String, status: Number) => {
  const obj = { business, status }
  baseFunc('currentStatus', obj)
}

/**
 * 设置机器人语音的工作状态
 * @param state | 1：关闭语音识别，2：就绪，可以唤醒，3：已经唤醒，正常交流
 */
export const setAIUIState = (state: number) => {
  const obj = { state }
  baseFunc('setAIUIState', obj)
}

/**
 * 告知客户端开始播放具体内容的语音
 * @param text 
 */
export const playSound = (text: string) => {
  const obj = { text }
  baseFunc('playSound', obj)
}

/**
 * 切换多语言
 * @param language 
 */
export const switchLanguage = (language: string) => {
  const obj = { language }
  baseFunc('switchLanguage', obj)
}

/**
 * 开舱门
 */
export const openDoor = () => {
  baseFunc('openDoor')
}

/**
 * 旋转机器人
 */
export const robotRotate180 = () => {
  baseFunc('robotRotate180')
}

/**
 * 移动任务
 * @param marker 
 */
export const move = (marker: string): Promise<any> | void => {
  const obj = { marker }
  // baseFunc('move', obj)
  return syncBaseFunc('move', obj)
}

/**
 * 取消移动任务
 */
export const cancelMove = () => {
  baseFunc('cancelMove')
}

/**
 * 获取机器人地图中的全部点位列表
 */
export const getMarkerList = () => {
  const obj = { 'type': -1 }
  baseFunc('getMarkerList', obj)
}

/**
 * 获取地图基础信息
 */
export const getCurrentMapInfo = () => {
  baseFunc('getCurrentMapInfo')
}

/**
 * 控制 “暂停导航” 灯的开关
 * @param state | 0：开，1：关
 */
export const upperOpenSuspendLight = (state: number) => {
  const obj = { state }
  baseFunc('upperOpenSuspendLight', obj)
}

/**
 * 播放背景声音
 * @param sound 
 * @param loop 
 */
export const playBackSound = (sound: string, loop: boolean) => {
  const obj = { sound, loop }
  baseFunc('playBackSound', obj)
}

/**
 * 停止播放背景声音
 * @param sound 
 */
export const stopBackSound = (sound: string) => {
  const obj = { sound }
  baseFunc('stopBackSound', obj)
}

/**
 * 退出程序
 */
export const exitProgram = () => {
  baseFunc('exitProgram')
}

/* 基础函数封装 */
/**
 * 请求体结构：
 * {
 *   'type': 'request',
 *   'method': 'xxxxx',
 *   'body': obj
 * }
 * @param funcName
 * @param obj 
 */
const baseFunc = (funcName: string, obj?: any) => {
  const body = obj ? obj : {}
  if(window.cefQuery) {
    console.log(`send: ${funcName}, body: ${body}`)
    window.cefQuery({
      request: JSON.stringify({
        'type': 'request',
        'method': funcName,
        'body': body
      }),
      onSuccess: (res) => {},
      onFailure: (err) => {}
    })
  }
}

const syncBaseFunc = (funcName: string, obj?: any): Promise<any> | void => {
  const body = obj ? obj : {}
  if(window.cefQuery) {
    return new Promise((resolve, reject) => {
      console.log(`sync send: ${funcName}, body: ${body}`)
      window.cefQuery({
        request: JSON.stringify({
          'type': 'request',
          'method': funcName,
          'body': body
        }),
        onSuccess: (res) => {
          console.log('success res: ', res)
          resolve(res)
        },
        onFailure: (code, msg) => {
          console.log(`error code: ${code}, msg: ${msg}`)
          reject(code)
        }
      })
    })
  }
}