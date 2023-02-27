<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="kb_wrap">
        <PasswordKeyboard @confirm="verifyPassword"></PasswordKeyboard>
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
import { playSound } from '../../utils/JSCallC'

const { t } = useI18n()
const title = ref(t('tip.inputPassword'))
const router = useRouter()
const store = useStore()

const verifyPassword = (password: string) => {
  // 与存储在数据中心的密码进行比较
  if(password === store.state.secret) {  
    router.push('/11-VerifySuccess')
  }else {
    if(store.state.robotConfig.serverPhone) {
      title.value = `${t('tip.passwordIncorrectAndContact')} ${store.state.robotConfig.serverPhone}`
    }else {
      title.value = t('tip.passwordIncorrect')
    }
    playSound(title.value)
  }
}
</script>

<style lang="scss" scoped>
.kb_wrap{
  padding-top: 180px;
}
</style>