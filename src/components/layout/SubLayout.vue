<template>
  <div class="sub_layout_container">
    <div class="header_wrap">
      <div class="back_wrap" @click="back">
        <el-icon :size="40" color="#fff">
          <arrow-left />
        </el-icon>
        <span class="word">{{$t('general.back')}}</span>
      </div>
      <div class="home_wrap" @click="home">
        <el-icon :size="40" color="#fff">
          <home-filled />
        </el-icon>
        <span class="word">{{$t('general.home')}}</span>
      </div>
    </div>
    <div class="content_wrap">  
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>

const router = useRouter()
const back = () => {
  router.go(-1)
}
const home = () => {
  router.push('/home')
}
</script>

<style lang="scss" scoped>
.sub_layout_container{
  height: 100%;
  .header_wrap{
    height: 45px; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back_wrap, .home_wrap{
      display: flex;
      align-items: center;
      .word{
        font-size: 25px;
        font-weight: 400;
        color: #fff;
        margin-left: 5px;
      }
    }
  }
  .content_wrap{
    height: calc(100% - 45px);
    padding-top: 90px;
    padding-bottom: 100px;
  }
}
</style>