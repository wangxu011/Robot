<template>
  <SubLayout>
    <div class="food_container">
      <div class="inner_wrap">
        <div class="search_input_wrap">
          <el-input
            v-model="formData.name"
            :placeholder="$t('general.input')"
            @input="inputChange">
          </el-input>
        </div>
        <div class="middle_wrap">
          <div class="category_wrap">
            <el-tabs @tab-click="tabClick" v-model="tabModel">
              <el-tab-pane
                v-for="item in tabList.data" 
                :key="item.id" 
                :name="item.prefix"
                :label="item.name">
              </el-tab-pane>
            </el-tabs>
          </div>
          <ShopLoop
            @detail="getPoiId"
            @next="getOnePageData"
            :list="swiperList.data"
            :onePageList="swiperList.onePageData"
            :total="total"
            v-show="swiperList.data.length > 0">
          </ShopLoop>
          <div class="no_data" v-show="swiperList.data.length === 0">{{$t('general.noData')}}</div>
        </div>
        <div class="map_wrap">
          <OpenLayer :poiId="poiId"></OpenLayer>
          <!-- <TestOpenLayer></TestOpenLayer> -->
        </div>
      </div>
    </div>
  </SubLayout>
</template>

<script lang="ts" setup>
import { useShop } from '../hooks/shop'

const { formData, swiperList, tabModel, tabList, total, poiId, 
    init, inputChange, tabClick, getOnePageData, getPoiId } = useShop()

onMounted(() => {
  init('购物')
})
</script>

<style lang="scss" scoped>
.food_container{
  height: 100%;
  :deep(.inner_wrap){
    height: 100%;
    .search_input_wrap{
      .el-input{
        .el-input__inner{
          height: 48px;
          line-height: 48px;
          font-size: 20px;
          border-radius: 24px;
          border: 1px solid #00ddc9;
          background-color: #CDD3D6;
          text-align: center;
          color: #303639;
        }
        .el-input__inner::-webkit-input-placeholder{
          color: #303639;
        }
      }
    }
    .middle_wrap{
      border-radius: 15px;
      background-color: #fff;
      box-shadow: -1px 5px 13px 0px rgba(37, 38, 38, 0.3);
      margin-top: 20px;
      .category_wrap{
        padding: 0 100px;
        .el-tabs{
          height: 50px;
          .el-tabs__header{
            margin-bottom: 0;
            .el-tabs__nav-prev, .el-tabs__nav-next {
              line-height: 60px;
              .el-icon{
                font-size: 20px;
              }
            }
          }
          .el-tabs__item{
            min-width: 130px;
            height: 50px;
            line-height: 50px;
            color: #B2B2B2;
            font-size: 18px;
          }
          .el-tabs__item.is-active{
            color: #00ddc9;
            font-weight: bold;
          }
          .el-tabs__active-bar{
            height: 5px;
            background-color: #00ddc9;
          }
          // 修改el-tabs的最下面的横线的颜色
          // .el-tabs__nav-wrap::after{
            // background-color: orange;
          // }
        }
      }
      .no_data{
        height: 420px;
        font-size: 40px;
        line-height: 420px;
      }
    }
    .map_wrap{
      height: calc(100% - 558px);
      margin-top: 20px;
      background-color: lightblue;
    }
  }
}
</style>