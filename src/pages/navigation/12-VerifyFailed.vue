<template>
  <NaviLayout :title="title">
    <template v-slot:content>
      <div class="btn_wrap">
        <div class="btn" @click="usePassword">
          <LoopTextContainer>{{$t('general.enterPassword')}}</LoopTextContainer>
        </div>
        <div class="btn" @click="reVerify">
          <LoopTextContainer>{{$t('general.verifyFaceAgain')}}</LoopTextContainer>
        </div>
      </div>
      <div class="img_wrap">
        <img src="../../assets/images/navigation/verify_failed.png" alt="">
      </div>
    </template>
  </NaviLayout>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const title = t('tip.verifyFailed')
const router = useRouter()

const usePassword = () => {
  router.push('/13-PasswordValidation')
}

const reVerify = () => {
  router.push('/10-VerifyFace')
}
</script>

<style lang="scss" scoped>

</style>