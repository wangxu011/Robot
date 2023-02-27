<template>
  <div class="gps-bg">
    <div class="gps-bg__guts">
      <div id="animation" class="gps-bg__bg"></div>
      <div class="gps-bg__route"></div>
      <div class="gps-bg__marker"></div>
    </div>
    <div class="gps-bg__fade"></div>
    <h1 class="hero__title"></h1>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.gps-bg {
  background-color: #18181a;
  position: relative;
  -webkit-perspective: 100vh;
  perspective: 100vh;
  height: 100vh;
  overflow: hidden;
  &:after {
    content: "";
    background-color: #fafafa;
    position: absolute;
    width: 100%;
    bottom: 0;
    transform: skewY(-2deg);
    overflow: hidden;
  }
  .gps-bg__guts {
    transform: rotateX(30deg);
    height: 300vh;
  }
  .gps-bg__bg {
    width: 300%;
    height: 100%;
    background-image: url("../../assets/images/roads.svg");
    background-repeat: repeat;
    background-size: 25%;
    position: absolute;
    left: -100%;
    animation: driving 12s linear 0ms infinite;
  }
  .gps-bg__route {
    width: 40px;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: -60%;
    bottom: -60%;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 13px 5px rgba(46, 18, 107, 0.25);
  }
  .gps-bg__fade {
    background-image: linear-gradient(to bottom, #18181a 10%, rgba(172, 141, 255, 0) 100%);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .gps-bg__marker {
    height: 180px;
    width: 150px;
    background-color: #fff;
    border-right: 1px solid #ddd;
    border-bottom: 3px solid #ddd;
    border-left: 1px solid #ddd;
    border-radius: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0.125em 10px 3px rgba(46, 18, 107, 0.25);
    background: #fff url("../../assets/images/reconova_small.png") no-repeat center/80%;
  }
}

@keyframes driving {
  0% {
    transform: translateY(-1600px);
  }

  100% {
    transform: translateY(-865px);
  }
}

</style>