<template>
  <div class="navigation_container">
    <div class="back_wrap" @click="backToHome" v-show="route.path==='/3-PreAsk'">
      <el-icon :size="40" color="#fff">
        <arrow-left />
      </el-icon>
      <span class="word">{{$t('general.back')}}</span>
    </div>
    <div class="tip_wrap" v-html="props.title"></div>
    <div class="line"></div>
    <div class="content_wrap">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { playSound } from '../../utils/JSCallC'

const props = defineProps({
  title: {
    type: String
  }
})

const route = useRoute()
const router = useRouter()

watch(() => props.title, (val, oldVal) => {
  if(val) {
    // 去掉 title 中的 <br />
    const res = val.replace(/<br \/>/g, '')
    // 语音播放页面头部的文字内容
    playSound(res)
  }
}, { immediate: true })

const backToHome = () => {
  router.push('/home')
}
</script>

<style lang="scss" scoped>
.navigation_container{
  height: 100%;
  padding-top: 50px;
  position: relative;
  .back_wrap{
    display: flex;
    position: absolute;
    top: 0;
    align-items: center;
    .word{
      font-size: 25px;
      font-weight: 400;
      color: #fff;
      margin-left: 5px;
    }
  }
  .tip_wrap{
    height: 330px;
    font-size: 50px;
    font-weight: 400;
    color: #fff;
    line-height: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .line{
    height: 4px;
    background: linear-gradient(31deg, rgba(4, 218, 170, 0.81), rgba(84, 251, 251, 0.81));
    border-radius: 2px;
  }
  .content_wrap{
    height: calc(100% - 334px);
    position: relative;
    overflow: hidden;
  }
}
</style>