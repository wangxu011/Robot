<template>
  <div class="keyboard_wrap">
    <div class="top_line">
      <div class="item"
        v-for="item in containers"
        :key="item.index"
        :class="{'selected': item.index === selectedIndex}">
        {{item.label}}
      </div>
      <div class="confirm" @click="confirm">{{$t('general.enter')}}</div>
    </div>
    <div class="key_wrap">
      <div class="item"
        v-for="item in keys"
        :key="item"
        @click="input(item)">{{item}}</div>
      <div class="back" @click="backspace">
        <img src="../assets/images/backspace.png" alt="">
        <span>{{$t('general.del')}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createMsg } from '../utils/message'

import { playBackSound } from '../utils/JSCallC'

// 键盘数字
const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

type containerItem = {
  index: number,
  value: number | undefined,
  label: string
}
// 四个显示数字的框
const containers = ref<containerItem[]>([
  {
    index: 1,
    value: undefined,
    label: ''
  },
  {
    index: 2,
    value: undefined,
    label: ''
  },{
    index: 3,
    value: undefined,
    label: ''
  },
  {
    index: 4,
    value: undefined,
    label: ''
  }
])

// 当前要被输入的数字索引
const selectedIndex = ref(1)

const input = (input: number) => {
  // 第二个条件是防止位于第四位的数字会被覆盖的情况
  if(selectedIndex.value <= 4 && containers.value[3].value === undefined) {
    playBackSound('keyboard_press.wav', false)
    containers.value[selectedIndex.value - 1].value = input
    containers.value[selectedIndex.value - 1].label = '*'
  }
  if(selectedIndex.value < 4)
    selectedIndex.value ++
}

const backspace = () => {
  // 第四位特殊，只清除数字，并不移动光标
  if(containers.value[3].value !== undefined) {
    containers.value[3].value = undefined
    containers.value[3].label = ''
  }else {
    if(selectedIndex.value > 1) {
      selectedIndex.value --
      containers.value[selectedIndex.value - 1].value = undefined
      containers.value[selectedIndex.value - 1].label = ''
    }
  }
}

const { t } = useI18n()
const emit = defineEmits(['confirm'])
const confirm = () => {
  if(containers.value[3].value === undefined) {
    createMsg('warning', t('tip.inputPassword2'))
  } else {
    let res = ''
    containers.value.forEach((item:containerItem)  => {
      res += item.value
    })
    // 将结果传递给父组件
    emit('confirm', res)
  }
}
</script>

<style lang="scss" scoped>
.keyboard_wrap{
  width: 660px;
  margin: 0 auto;
  .top_line{
    display: flex;
    justify-content: space-between;
    .item{
      width: 100px;
      height: 95px;
      border-radius: 5px;
      line-height: 95px;
      background-color: #fff;
      font-size: 32px;
    }
    .selected{
      border: 3px solid #18FFD1;
    }
    .confirm{
      width: 169px;
      height: 95px;
      background: linear-gradient(147deg, rgba(4, 218, 170, 0.81), rgba(84, 251, 251, 0.81));
      border-radius: 5px;
      font-size: 45px;
      line-height: 95px;
      color: #fff;
    }
  }
  .key_wrap{
    width: 660px;
    border-radius: 5px;
    background: linear-gradient(129deg, #FFFFFF, #E4E4E4);
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    .item{
      width: 220px;
      height: 130px;
      line-height: 130px;
      font-size: 45px;
    }
    .back{
      width: 440px;
      font-size: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        margin-right: 10px;
      }
    }
  }
}
</style>