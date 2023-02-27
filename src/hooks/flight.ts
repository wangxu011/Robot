/**
 * 动态航班相关方法及数据
 */
import { _queryFlights } from '../axios/api/flightController'
import { createMsg } from '../utils/message'

import { ElLoading } from 'element-plus'

export const useFlight = () => {

  const { t } = useI18n() 

  const data: any = reactive({
    formData: {
      direction: 'D', // 'D': 出发；'A': 到达
      key: '',
      page: 0,
      size: 25,
      sort: 'schedule_datetime,asc',
      estimateTimeBefore: new Date().getTime() + 86400000,
      estimateTimeAfter: new Date().getTime(),
      onlyMasterFlight:  true
    },
    list: []
  })

  let loading: any = null
  // 获取带着搜索条件的航班列表（单页）
  const getList = () => {
    loading = ElLoading.service()
    _queryFlights(data.formData).then(async res => {
      data.list = await Promise.all(res.value.results.map(item => {
        // 判断是否存在共享航班
        const flightNoProp: any = { shareList: null }
        let flightNos: any[] = []
        flightNos.push(item.flightIdentity)
        if(item.shareCodeFlight) {
          const shareFlights = item.shareCodeFlight.split(',')
          shareFlights.forEach(flight => {
            // 从总线获取到的共享航班的字符为：CZ2354#0，需要将 '#0' 去掉
            flightNos.push(flight.split('#')[0])
          })
        }
        flightNoProp.shareList = flightNos
        // 单独处理目的地，可能有多个
        const destProp: any = { destsList: null }
        if(item.portOfCallDTOs.length) {
          let dest: any[] = []
          item.portOfCallDTOs.forEach((e, index) => {
            if(index === 0) {
              if(!(e.airportName === '杭州萧山' || e.airportName === 'Hangzhou')) {
                e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
              }
            }else if(index === item.portOfCallDTOs.length - 1) {
              if(!(e.airportName === '杭州萧山' || e.airportName === 'Hangzhou')) {
                e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
              }
            }else {
              e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
            }
          })
          destProp.destsList = dest
        }
        // 单独处理登机口，可能有多个
        const gateProp = { gateLabel: '' }
        if(item.gates.length) {
          let gates = ''
          item.gates.forEach(e => {
            if(e.gateNumber)
              gates += e.gateNumber + '/'
          })
          gates = gates.substring(0, gates.length - 1)
          gateProp.gateLabel = gates
        }
        return {...item, ...destProp, ...gateProp, ...flightNoProp}
      }))
    }).finally(() => {
      loading.close()
    })
  }

  // 搜索框值的变化触发，防抖延时为1000ms
  let timer: any = null
  const inputChange = (e) => {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      data.formData.page = 0
      getList()
    }, 600)
  }

  // 航班列表滚动触发下一页
  const nextPage = () => {
    loading = ElLoading.service()
    data.formData.page ++
    _queryFlights(data.formData).then(async res => {
      if(res.value.results.length === 0) {
        createMsg('warning', t('tip.loadAll'))
      }else {
        let list = await Promise.all(res.value.results.map(item => {
          // 判断是否存在共享航班
          const flightNoProp: any = { shareList: null }
          let flightNos: any[] = []
          flightNos.push(item.flightIdentity)
          if(item.shareCodeFlight) {
            const shareFlights = item.shareCodeFlight.split(',')
            shareFlights.forEach(flight => {
              // 从总线获取到的共享航班的字符为：CZ2354#0，需要将 '#0' 去掉
              flightNos.push(flight.split('#')[0])
            })
          }
          flightNoProp.shareList = flightNos
          // 单独处理目的地，可能有多个
          const destProp: any = { destsList: null }
          if(item.portOfCallDTOs.length) {
            let dest: any[] = []
            item.portOfCallDTOs.forEach((e, index) => {
              if(index === 0) {
                if(!(e.airportName === '杭州萧山' || e.airportName === 'Hangzhou')) {
                  e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
                }
              }else if(index === item.portOfCallDTOs.length - 1) {
                if(!(e.airportName === '杭州萧山' || e.airportName === 'Hangzhou')) {
                  e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
                }
              }else {
                e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
              }
            })
            destProp.destsList = dest
          }
          // 单独处理登机口，可能有多个
          const gateProp = { gateLabel: '' }
          if(item.gates.length) {
            let gates = ''
            item.gates.forEach(e => {
              if(e.gateNumber)
                gates += e.gateNumber + '/'
            })
            gates = gates.substring(0, gates.length - 1)
            gateProp.gateLabel = gates
          }
          return {...item, ...destProp, ...gateProp, ...flightNoProp}
        }))
        data.list = data.list.concat(list)
      }
    }).finally(() => {
      loading.close()
    })
  }

  // 出发
  const depart = () => {
    data.formData.direction = 'D'
    data.formData.page = 0
    data.formData.key = ''
    data.formData.sort = 'schedule_datetime,asc'
    data.formData.estimateTimeBefore = new Date().getTime() + 86400000,
    data.formData.estimateTimeAfter = new Date().getTime()
    getList()
  }

  // 到达
  const arrive = () => {
    data.formData.direction = 'A'
    data.formData.page = 0
    data.formData.key = ''
    data.formData.sort = 'schedule_datetime,asc'
    data.formData.estimateTimeBefore = new Date().getTime() + 18000000,
    data.formData.estimateTimeAfter = new Date().getTime() - 3600000
    getList()
  }

  return { data, getList, inputChange, nextPage, depart, arrive }
}