<template>
  <div class="item1" @click="turnTo" :style="props.layout">
    <div class="img_wrap">
      <img src="../../assets/images/routes/7.png" alt="">
    </div>
    <p class="label">{{$t('subPage.traffic.title')}}</p>
  </div>
</template>

<script lang="ts" setup>
import { _getCategoryByLabel } from '../../axios/api/categoryController'
import { categoryMap } from '../../utils/generalMap'
import { createMsg } from '../../utils/message'

import { currentStatus } from '../../utils/JSCallC'

const props = defineProps({
  layout: {
    type: Object
  }
})

// 栏目渲染的模板类型：NO_PIC LITTLE_PIC BIG_PIC COMPOSED
const type = ref('')

const label = '交通服务'

const { t } = useI18n()
const router = useRouter()
const turnTo = () => {
  // 发给客户端业务类型，用于统计，99代表 "其他"
  currentStatus('99', 1)

  // 获取 “交通指南” 对应的模式，然后跳转至对应的渲染模板，并传递label
  _getCategoryByLabel(label).then(res => {
    console.log(res)
    if(res.value) {
      type.value = res.value.module
      if(type.value) {
        router.push(`${categoryMap[type.value]}?label=${label}&id=`)
      }else {
        createMsg('warning', t('general.noData'))
      }
    }
  })
}
</script>

<style lang="scss" scoped>
</style>