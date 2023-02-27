import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'

import { createMsg } from '../utils/message'

import { getCookie } from '../utils/cookies'

const RobotAxios: AxiosInstance = axios.create()

if(process.env.NODE_ENV === 'development') {
  // RobotAxios.defaults.baseURL = 'http://192.168.88.50/fids'
  RobotAxios.defaults.baseURL = 'http://wap.hzairport.com/fids'
} else {
  // 从cookie中获取fidsIP，首次会获取不到
  RobotAxios.defaults.baseURL = getCookie('fidsIP') || 'http://localhost/fids'
}

RobotAxios.defaults.timeout = 60000

RobotAxios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 判断是否为从DMZ区域发出的请求，若是，则需将协议由 http 改为 https
    if(config.baseURL) {
      const urlArr = config.baseURL.split('/')
      if(urlArr[2].startsWith('wap.hzairport.com')) {
        config.baseURL = config.baseURL.replace('http', 'https')
      }else if(urlArr[2].startsWith('localhost')){
        // 重新拦截请求，从cookie中获取fidsIP作为baseURL
        config.baseURL = getCookie('fidsIP')
      }
    }
    // 缩小config.headers的范围，避免TS的检查报错
    if(config.headers === undefined){
      config.headers = {} 
    }
    let lang = ''
    if(getCookie('lang') && (getCookie('lang') === 'EN')) {
      lang = 'en-US'
    }else {
      lang = 'zh-CN'
    }
    // 在请求头中添加多语言的设置
    config.headers['Accept-Language'] = lang
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

RobotAxios.interceptors.response.use(
  (res: AxiosResponse) => {
    if(res.status === 200) {
      if(res.data.code === 200) {
        return Promise.resolve(res.data)
      }else {
        // 针对人脸比对接口，不显示报错信息，在调用位置直接捕获错误，直接跳转到未比中
        if(res.data.code !== 100012)
          createMsg('error', res.data.message)
        return Promise.reject(res.data)
      }
    }else {
      createMsg('error', res.data)
      return Promise.reject(res.data)
    }
  },
  (error: any) => {
    createMsg('error', error)
    console.log(error)
    return Promise.reject(error)
  }
)
export default RobotAxios