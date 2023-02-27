<template>
  <div class="shop_list_container">
    <div class="shop_loop_wrapper">
      <div class="left" @click="prev" v-if="swiperLeft < 0">
        <el-icon :size="45" color="#00DDC9">
          <arrow-left />
        </el-icon>
      </div>
      <div class="right" @click="next" v-if="Math.ceil(props.total/10) > currentPage">
        <el-icon :size="45" color="#00DDC9">
          <arrow-right />
        </el-icon>
      </div>
      <div class="shop_page_container clearfix"
        :style="{'width': swiperWidth + 'px','left': swiperLeft + 'px'}">
        <div class="shop_page"
          v-for="(sItem, index) in swiperList.list"
          :key="index">
          <div class="shop_item" v-for="s in sItem" :key="s.id" @click="showDetail(s)">
            <div class="img_wrap" v-if="s.logo">
              <img :src="prefixImg(s.logo)">
            </div>
            <div class="default_img" v-else>{{$t('general.noPic')}}</div>
            <p class="shop_name">{{s.name}}</p>
          </div>
        </div>
      </div>
    </div>
    <transition name="drop">
      <div class="show_detail_wrap" v-show="detailFlag" @click="detailFlag=false">
        <div class="img_wrap" v-if="data.detail.logo">
          <img :src="prefixImg(data.detail.logo)" alt="">
        </div>
        <div class="default_img" v-else>{{$t('general.noPic')}}</div>
        <div class="right_part">
          <div class="first_row">
            <p class="shop_name">{{data.detail.name}}</p>
            <p class="shop_type">{{data.detail.categoryCode}}</p>
          </div>
          <div class="second_row">
            <img src="../assets/images/shop_location.png">
            <p class="position">{{data.detail.address}}</p>
            <!-- <p class="distance">{{data.detail.distance}}</p> -->
          </div>
          <div class="third_row">
            <p class="price">{{data.detail.price}}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  // 当切换搜索条件和分类时会重置，向右翻页时是追加！！！
  list: {
    type: Array as () => Array<any>,
    required: true
  },
  // 向右翻页时的追加页
  onePageList: {
    type: Array as () => Array<any>,
    required: false
  },
  // 商铺总数
  total: {
    type: Number,
    required: true
  }
})

/**
 * next: 轮播组件点击下一页触发事件
 * detail: 店铺点击触发事件，回传对应店铺的poiId
 */
const emit = defineEmits(['next', 'detail'])

// 轮播容器向左移动的偏移量，一页的偏移量是940
const swiperLeft = ref(0)
// 轮播容器的宽度
const swiperWidth = computed(() => swiperList.list.length * 940)
// 当前显示的页数
const currentPage = ref(1)

const prev = () => {
  swiperLeft.value += 940
  currentPage.value --
}
const next = () => {
  swiperLeft.value -= 940
  currentPage.value ++
  // 避免获取重复数据
  if((swiperList.list.length === currentPage.value) && currentPage.value * 10 < props.total) {
    // 提前获取下一页数据进行缓存
    emit('next', currentPage.value)
  }
}

const swiperList: any = reactive({
  list: []
})

const data = reactive({
  detail: {
    id: '',
    name: '',
    imgPath: '',
    type: '',
    position: '',
    distance: '',
    price: '',
    categoryCode: '',
    address: '',
    logo: ''
  }
})

const detailFlag = ref(false)

const splitList = (arr: any[], n: number): any[] => {
  let result: any[] = []
  for(let i=0; i<arr.length; i += n) { 
    result.push(arr.slice(i, i + n))
  }
  return result
}

watch(() => props.list, (val, oldVal) => {
  swiperLeft.value = 0
  currentPage.value = 1
  swiperList.list = splitList(val, 10)
})

watch(() => props.onePageList, (val, oldVal) => {
  swiperList.list.push(val)
})



const showDetail = (s: any) => {
  detailFlag.value = true
  data.detail = s
  emit('detail', s.poiId)
}

const prefixImg = (base64: string): string => {
  return 'data:image/jpg;base64,' + base64
}

const vSwiper = {
  updated(el, binding) {
    swiper(el, 'update...')
  }
}
// 动态计算轮播容器的宽度
const swiper = (el: any, type: string) => {
  const parentWidth = el.parentNode.clientWidth
  el.style.width = swiperList.list.length * parentWidth + 'px'
}
</script>

<style lang="scss" scoped>
  .shop_list_container{
    width: 100%;
    height: 420px;
    position: relative;
    .shop_loop_wrapper{
      height: 100%;
      position: relative;
      overflow: hidden;
      .left{
        position: absolute;
        top: 170px;
        left: 0;
        z-index: 99;
      }
      .right{
        position: absolute;
        top: 170px;
        right: 0;
        z-index: 99;
      }
      .shop_page_container{
        position: absolute;
        left: 0;
        top: 0;
        transition: .5s;
        height: 356px;
        overflow-y: hidden;
        .shop_page{
          width: 940px;
          float: left;
          display: flex;
          flex-wrap: wrap;
          .shop_item{
            width: 16%;
            margin: 0 2%;
            margin-bottom: 5px;
            padding-top: 30px;
            .img_wrap{
              width: 110px;
              height: 110px;
              border-radius: 55px;
              overflow: hidden;
              margin: 0 auto;
              position: relative;
              img{
                height: 100%;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
              }
            }
            .default_img{
              width: 110px;
              height: 110px;
              border-radius: 55px;
              background-color: #D6D8D9;
              color: #fff;
              font-size: 25px;
              line-height: 110px;
              margin: 0 auto;
            }
            .shop_name{
              font-size: 23px;
              margin-top: 10px;
              color: #000;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          } 
        }
      }
    }
    .show_detail_wrap{
      width: 662px;
      height: 226px;
      box-shadow: 0 2px 12px 0 #eee;
      border-radius: 10px;
      bottom: -250px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      position: absolute;
      margin-left: -331px;
      left: 50%;
      z-index: 9999999;
      background-image: url('../assets/images/shop_detail.png');
      background-size: cover;
      .img_wrap{
        width: 180px;
        height: 180px;
        overflow: hidden;
        position: relative;
        img{
          height: 100%;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .default_img{
        width: 180px;
        height: 180px;
        padding: 40px;
        background-color: #D6D8D9;
        color: #fff;
        font-size: 40px;
        line-height: 1.2em;
      }
      .right_part{
        width: 430px;
        padding: 30px 10px;
        .first_row{
          display: flex;
          justify-content: space-between;
          .shop_name{
            width: 336px;
            font-size: 42px;
            text-align: left;
          }
          .shop_type{
            width: 60px;
            font-size: 24px;
            color: #4DACA2;
            word-wrap: break-word;
          }
        }
        .second_row{
          display: flex;
          align-items: flex-start;
          // justify-content: space-between;
          margin-top: 20px;
          img{
            width: 22px;
          }
          .position{
            font-size: 24px;
            margin-left: 15px;
            text-align: left;
          }
          .distance{
            font-size: 24px;
            margin-left: 30px;
          }
        }
        .third_row{
          margin-top: 20px;
          .price{
            text-align: left;
            font-size: 24px;
            color: #E60A0A;
          }
        }
      }
    }
  }
</style>