<template>
  <div class="outer_wrap">
    <p class="content" v-loop="123"><slot></slot></p>
  </div>
</template>

<script lang="ts" setup>

let timer: NodeJS.Timer | null = null
const loop = (el: any, type: string) => {
  const container = el.parentNode
  // 容器宽度
  const containerWidth = container.clientWidth
  // 获取内部元素的实际宽度
  const textActualWidth = el.scrollWidth

  if(textActualWidth > containerWidth) {
    if(timer)
      clearInterval(timer)
    let scroll = -10
    timer = setInterval(() => {
      if(scroll <= (textActualWidth - containerWidth + 50)) {
        scroll ++
        container.scrollLeft = scroll
      } else {
        scroll = -10
        container.scrollLeft = -10
      }
    }, 30)
  }
}

// 自定义指令
const vLoop = {
  mounted(el, binding) {
    loop(el, 'mounted...')
  },
  updated(el, binding) {
    loop(el, 'update...')
  }
}

onUnmounted(() => {
  timer && clearInterval(timer)
})

</script>

<style lang="scss" scoped>
.outer_wrap{
  position: relative;
  overflow: hidden;
  .content{
    white-space:nowrap;
    line-height: normal;
  }
}
</style>