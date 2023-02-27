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
import { openDoor, robotRotate180 as send } from '../../utils/JSCallC'
import { robotRotate180 as recieve, removeRobotRotate180, openDoor as recieveDoorStatus, removeOpenDoor } from '../../utils/CCallJS'

const router = useRouter()

const { t } = useI18n()
const title = t('tip.openDoor', { robotName: t('general.robotName') })

onMounted(() => {
  // 发送旋转信号
  send()
  // 监听旋转完毕结果，随后发送开门信号
  recieve(() => {
    openDoor()
  })
  // 监听门的状态，当收到开门状态时，跳转到 /6-PutPackage
  recieveDoorStatus((res: any) => {
    if(res.body.state === 0) {
      router.push('/6-PutPackage')
    }else {
      // 开门失败的情况，跳转到开门失败页面
      router.push('/openDoorFailed')
    }
  })
})

onBeforeUnmount(() => {
  removeOpenDoor()
  removeRobotRotate180()
})

</script>

<style lang="scss" scoped>
</style>