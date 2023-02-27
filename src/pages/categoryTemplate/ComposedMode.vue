<template>
  <SubLayout>
    <el-scrollbar>
      <div class="composed_mode_wrap">
        <div class="item_wrap">
          <div class="item" v-for="(item, index) in data.list" :key="index">
            <p class="title">{{item.title}}</p>
            <div class="sub_item_wrap">
              <div class="sub_item"
                v-for="(subItem, i) in item.children" 
                :key="i"
                @click="turnTo(subItem)">
                <div class="img_wrap">
                  <img :src="prefixImg(subItem.icon)">
                </div>
                <p class="sub_title">{{subItem.title}}</p>
              </div>
            </div>
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

const { data, getDataForCompositeMode,
    dialogVisible, dialogLoading, dialogTitle, showHtml, iframeSrc, contentType, turnTo, prefixImg } = useCategory()

onMounted(() => {
  getDataForCompositeMode()
})
</script>

<style lang="scss" scoped>
.composed_mode_wrap{
  height: 100%;
  .item_wrap{
    .item{
      // background-color: #3D4549;
      border-radius: 10px;
      padding: 23px 28px;
      margin-bottom: 25px;
      .title{
        font-size: 36px;
        font-weight: bold;
        color: #fff;
        text-align: left;
        margin-bottom: 10px;
      }
      .sub_item_wrap{
        display: flex;
        flex-wrap: wrap;
        .sub_item{
          width: 20%;
          margin-top: 25px;
          .img_wrap{
            width: 58px;
            height: 58px;
            border-radius: 7px;
            background-color: #E2F6F6;
            position: relative;
            margin: 0 auto;
            overflow: hidden;
            img{
              height: 100%;
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
            }
          }
          .sub_title{
            margin-top: 15px;
            font-size: 24px;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>