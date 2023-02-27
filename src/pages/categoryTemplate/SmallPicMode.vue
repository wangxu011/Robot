<template>
  <SubLayout>
    <el-scrollbar>
      <div class="small_mode_wrap">
        <div class="item_wrap">
          <div class="item" 
            v-for="(item, index) in data.list" 
            :key="index"
            @click="turnTo(item)">
            <div class="img_wrap">  
              <img :src="prefixImg(item.icon)">
            </div>
            <p class="title">{{item.title}}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <el-dialog
      v-loading="dialogLoading"
      v-model="dialogVisible"
      width="888px"
      custom-class="dialog32"
      :show-close="false">
      <p class="title32">{{dialogTitle}}</p>
      <div class="content_wrapper">
        <el-scrollbar>
          <div v-html="showHtml" class="ql-editor" v-if="contentType !== 'LINK'" style="height:100%"></div>
          <iframe :src="iframeSrc" style="height:100%" v-else></iframe>
        </el-scrollbar>
      </div>
      <template #footer>
        <div class="close" @click="dialogVisible=false"></div>
      </template>
    </el-dialog>
  </SubLayout>
</template>

<script lang="ts" setup>
import { useCategory } from '../../hooks/category'

const { data, getDataForSmallMode,
    dialogVisible, dialogLoading, dialogTitle, showHtml, iframeSrc, contentType, turnTo, prefixImg } = useCategory()

onMounted(() => {
  getDataForSmallMode()
})
</script>

<style lang="scss" scoped>
.small_mode_wrap{
  height: 100%;
  .item_wrap{
    display: flex;
    flex-wrap: wrap;
    .item{
      width: 32%;
      height: 235px;
      background-color: #535F67;
      border-radius: 15px;
      padding-top: 40px;
      margin-bottom: 55px;
      .img_wrap{
        width: 90px;
        height: 90px;
        border-radius: 45px;
        border: 3px solid #00DDC9;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        img{
          height: 100%;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .title{
        font-size: 40px;
        color: #fff;
        margin-top: 20px;
      }
    }
    .item:nth-of-type(3n+2){
      margin: 0 2%;
    }
  }
}
</style>