<template>
  <div class="loading-wrap">
    <img src="../../assets/images/reconova.png" alt="" />
    <div class="loading spin">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #18181a;
  position: relative;
  img {
    width: 600px;
    height: 600px;
    position: absolute;
    z-index: 2;
  }
  .loading {
    position: relative;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd);
    animation: spin 1.2s linear 0ms infinite;
    z-index: 1;
    &:after {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      background: #f1f1f1;
      border: solid white 10px;
      border-radius: 50%;
    }

    span {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd);
      left: 0;
      &:nth-child(1) {
        filter: blur(5px);
      }
      &:nth-child(2) {
        filter: blur(10px);
      }
      &:nth-child(3) {
        filter: blur(25px);
      }
      &:nth-child(4) {
        filter: blur(50px);
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>