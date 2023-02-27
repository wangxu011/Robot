<template>
  <SubLayout>
    <div class="mismatch_container">
      <p class="title">{{title}}</p>
      <div class="flight_wrap_robot">
        <FlightList
          :data="data.list"
          :direction="data.formData.direction"
          @next="nextPage">
        </FlightList>
      </div>
    </div>
  </SubLayout>
</template>

<script lang="ts" setup>
import { playSound } from '../utils/JSCallC'

import { useFlight } from '../hooks/flight'

const { data, getList, nextPage } = useFlight()

const { t } = useI18n()
const title = t('tip.unmatch', { robotName: t('general.robotName') })

onMounted(() => {
  getList()
  playSound(title)
})

</script>

<style lang="scss" scoped>
.mismatch_container{
  height: 100%;
  .title{
    height: 60px;
    line-height: 60px;
    color:#fff;
    font-size: 26px;
  }
  .flight_wrap_robot{
    height: calc(100% - 60px);
  }
}
</style>