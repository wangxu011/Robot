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
import { createMsg } from '../utils/message'
import { exitProgram } from '../utils/JSCallC'

const store = useStore()

const { t } = useI18n()
const title = t('tip.projectPassword')

const getPassword = (password: string) => {
  // 将密码与store中存储的工程密码进行比对，比对成功后，给客户端发信号，退出程序
  if(password === store.state.robotConfig.maintainPassword) {
    console.log('password correct')
    exitProgram()
  }else {
    createMsg('warning', t('tip.projectPasswordIncorrect'))
  }
}
</script>

<style lang="scss" scoped>
.kb_wrap{
  padding-top: 180px;
}
</style>