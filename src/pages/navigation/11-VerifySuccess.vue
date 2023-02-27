<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="img_wrap" :style="{'paddingTop':'255px'}">
        <img src="../../assets/images/navigation/close_door.png" alt="">
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
import { openDoor, robotRotate180 as rotateSend } from '../../utils/JSCallC'
import { robotRotate180 as rotateRecieve, removeRobotRotate180, openDoor as recieveOpenDoor, removeOpenDoor } from '../../utils/CCallJS'

import { useRouter } from 'vue-router'

const { t } = useI18n()
const title = t('tip.verifySuccess', { robotName: t('general.robotName') })
const router = useRouter()

const ifGetLuggage = ref(false) // 是否取了行李

onMounted(() => {
  // 发送旋转信号
  rotateSend()
  // 监听旋转完毕结果
  rotateRecieve(() => {
    // 如果没有取行李，则开门
    if(!ifGetLuggage.value) {
      openDoor()
    }else {
      // 如果已经取了行李，则跳转到 14-ThanksForUse
      router.push('/14-ThanksForUse')
    }
  })

  // 监听到关门状态，先旋转180度，变更取行李状态
  recieveOpenDoor((res: any) => {
    if(res.body.state === 1) {
      ifGetLuggage.value = true
      rotateSend()
    }
  })
})
onBeforeUnmount(() => {
  removeRobotRotate180()
  removeOpenDoor()
})

</script>

<style lang="scss" scoped>

</style>