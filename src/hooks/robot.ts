import { getDistance } from '../utils/tools'
import { move } from '../utils/JSCallC'
import { createMsg } from '../utils/message'
import { moveExceptionMap } from '../utils/generalMap'

export const useRobot = () => {
  const store = useStore()
  const router = useRouter()
  const { t } = useI18n() 

  const goBackStandby = () => {
    if(store.state.robotStatus.current_pose && store.state.robotStatus.current_pose.x) {
      const currentPos = [store.state.robotStatus.current_pose.x, store.state.robotStatus.current_pose.y]
      // 待机点对应点位坐标
      let standbyPos: number[] = []
      // 从store中获取所有的markerList
      const markerList = store.state.markerList
      // 从客户端返回的配置中，获取当前待机点位的key，默认为 "待机点"
      const standbyKey = store.state.robotConfig.homePosition
      for(let key in markerList) {
        if(key === standbyKey) {
          const x: number = markerList[key].pose.position.x
          const y: number = markerList[key].pose.position.y
          standbyPos = [x, y]
        }
      }
  
      /* 由于实际地图测试中，发现测算与待机点的距离时误差较大，故改为2，原本应该是 1 */
      // 计算当前点位与待机点位的距离，若 > 2 , 则认为还没有到达待机点，重新执行 "去待机点"
      const distance = getDistance(currentPos, standbyPos)
      console.log('distance: ', distance)
      if(distance > 2) {
        move(standbyKey)?.then(res => {
          console.log('turn back to home position...')
          router.push('/15-TurnBack')
        })?.catch(err => {
          createMsg('warning', t(moveExceptionMap[String(err)]))
        })
      }
    }
  }
  return { goBackStandby }
}