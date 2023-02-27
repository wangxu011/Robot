<template>
  <SubLayout>
    <div class="map_container">
      <OpenLayer :name="destName"></OpenLayer>
    </div>
  </SubLayout>
</template>

<script lang="ts" setup>

const route = useRoute()
const destName = ref('')
onMounted(() => {
  if(route.query.destName) {
    destName.value = String(route.query.destName)
  }
})
</script>

<style lang="scss" scoped>
.map_container{
  height: 100%;
  background-color: lightblue;
}
</style>