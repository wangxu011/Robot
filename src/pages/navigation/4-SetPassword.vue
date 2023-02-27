<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="kb_wrap">
        <PasswordKeyboard @confirm="getPassword"></PasswordKeyboard>
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
const store = useStore()
const router = useRouter()

const { t } = useI18n()
const title = t('tip.setPassword')

const getPassword = (password: string) => {
  console.log('password: ', password)
  // 将设置的开箱密码存到数据中心，用于后续验证
  store.commit('SET_SECRET', password)
  // 跳转到 5-OpeningDoor 页面
  router.push('/5-OpeningDoor')
}
</script>

<style lang="scss" scoped>
.kb_wrap{
  padding-top: 180px;
}
</style>