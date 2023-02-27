import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { createMsg } from '../../utils/message'

// 获取token接口对应的服务，处理逻辑与其它地图的逻辑不同
const HZTokenAxios = axios.create()
HZTokenAxios.interceptors.response.use(
  (res: AxiosResponse) => {
    if(res.status === 200) {
      if(res.data.status === 1000) {
        return Promise.resolve(res.data)
      }else {
        createMsg('error', res.data)
        return Promise.reject(res.data)
      }
    }
  },
  (error: any) => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 调用地图其它逻辑相关的接口
const HZMapAxios = axios.create()
if(window.location.hostname.startsWith('10.235')) {
  HZMapAxios.defaults.baseURL = `http://${config.hz.apiHost}`
}else {
  HZMapAxios.defaults.baseURL = `https://wap.hzairport.com/HZSZMap`
}

HZMapAxios.interceptors.response.use(
  (res: AxiosResponse) => {
    if(res.status === 200) {
      return Promise.resolve(res.data)
    }else {
      createMsg('error', res.data)
      return Promise.reject(res.data)
    }
  },
  (error: any) => {
    console.log(error)
    return Promise.reject(error)
  }
)

/**
 * 机场测试 - 获取token
 */
export const _getTestToken = () => {
  return HZTokenAxios.post(`http://192.168.120.104:90/HZToken`, {
    orgaFlag: '66',
    orgaKey: 'Nh0jpk/wnNcXVWr8FM9ucQ=='
  })
  // return HZTokenAxios.post(`http://106.38.108.70:18993/Auth/getToken`, {
  //   orgaFlag: '66',
  //   orgaKey: 'Nh0jpk/wnNcXVWr8FM9ucQ=='
  // })
}

/**
 * 机场线上 - 获取Token
 */
export const _getToken = () => {
  // 只有机场内网的资源使用机场内网的域，其余均使用dmz的域
  let tokenUrl = ''
  if(window.location.hostname.startsWith('10.235')) {
    // 内网直接使用自己内部的nginx缓存
    tokenUrl = 'http://10.235.68.21/HZToken'
  }else {
    tokenUrl = 'https://wap.hzairport.com/HZToken'
  }
  return HZTokenAxios.post(tokenUrl, {
    orgaFlag: config.hz.orgaFlag,
    orgaKey: config.hz.orgaKey
  })
}

/**
 * 根据名称模糊查询点位
 * @param name 
 * @returns 
 */
export const _queryByName = (name: string) => {
  return HZMapAxios.post(`/indoorPoi/queryByName?name=${name}`)
}

/**
 * 根据点位信息查询（地图上任意坐标点）
 * @param data 
 * @returns 
 */
export const _queryByPosition = (floor: string, lon: number, lat: number) => {
  return HZMapAxios.post(`/indoorPoi/queryByPosition?floor=${floor}&lon=${lon}&lat=${lat}`)
}

/**
 * 根据唯一编号（poiId）查询
 * @param code
 * @returns 
 */
export const _queryByCode = (code: string) => {
  return HZMapAxios.post(`/indoorPoi/queryByCode?code=${code}`)
}

/**
 * 传入两点，规划路径
 * @param data 
 * @returns 
 */
export const _planRoute = (data: object) => {
  return HZMapAxios.post('/indoor/plan', data)
}