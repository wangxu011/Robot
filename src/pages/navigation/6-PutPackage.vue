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
import { robotRotate180 as send } from '../../utils/JSCallC'
import { openDoor, removeOpenDoor, robotRotate180 as recieve, removeRobotRotate180} from '../../utils/CCallJS'

const router = useRouter()
const { t } = useI18n()
const title = t('tip.putPackage', { robotName: t('general.robotName') })

onMounted(() => {
  // 收到关门消息后，进行旋转
  openDoor((res: any) => {
    if(res.body.state === 1) {
      send()
    }
  })
  // 收到旋转完毕消息后，跳转到 7-CheckPackage
  recieve(() => {
    router.push('/7-CheckPackage')
  })
})

onBeforeUnmount(() => {
  removeOpenDoor()
  removeRobotRotate180()
})

</script>

<style lang="scss" scoped>
</style>