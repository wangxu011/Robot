<template>
  <SubLayout>
    <div class="flight_container">  
      <div class="inner_wrap">  
        <div class="top_wrap">
          <div class="btn" @click="depart">
            <div class="img_wrap" :class="{'selected':data.formData.direction === 'D'}">
              <img src="../assets/images/depart.png">
            </div>
            <div class="line"></div>
            <p class="name">
              <LoopTextContainer>{{$t('general.departure')}}</LoopTextContainer>
            </p>
          </div>
          <div class="img_wrap">
            <img src="../assets/images/plane.png">
          </div>
          <div class="btn" @click="arrive">
            <div class="img_wrap" :class="{'selected':data.formData.direction === 'A'}">
              <img src="../assets/images/arrive.png">
            </div>
            <div class="line"></div>
            <p class="name">
              <LoopTextContainer>{{$t('general.arrival')}}</LoopTextContainer>
            </p>
          </div>
        </div>
        <el-input
          v-model="data.formData.key"
          :placeholder="$t('subPage.flightSchedule.input')"
          @input="inputChange">
        </el-input>
        <div class="flight_wrap_robot">
          <FlightList
            :data="data.list"
            :direction="data.formData.direction"
            @next="nextPage">
          </FlightList>
        </div>
      </div>
    </div>
  </SubLayout>
</template>

<script lang="ts" setup>
import { useFlight } from '../hooks/flight'

const { data, getList, inputChange, nextPage, depart, arrive } = useFlight()

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.flight_container{
  height: 100%;
  :deep(.inner_wrap){
    height: 100%; 
    .top_wrap{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn{
        width: 295px;
        height: 125px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #384048;
        border-radius: 15px;
        padding: 21px 35px;
        border: 2px solid #38F4FF;
        box-shadow: 0px 2px 24px 0px rgba(15, 34, 83, 0.47);
        .img_wrap{
          width: 80px;
          height: 80px;
          border-radius: 40px;
          border: 1px solid #fff;
          position: relative;
          background-color: #DBDBDB;
          img{
            width: 70%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .selected{
          background-color: #FFDE00;
        }
        .name{
          width: 107px;
          font-size: 35px;
          color: #fff;
          border-left: 1px solid #00DDC9;
          padding-left: 35px;
        }
        .active{
          color: #FFDE00;
        }
      }
    }
    .el-input{
      margin-top: 30px;
      .el-input__inner{
        height: 48px;
        line-height: 48px;
        font-size: 20px;
        border-radius: 24px;
        border: 2px solid #00ddc9;
        background-color: #31373A;
        text-align: center;
        color: #eee;
      }
    }
    .flight_wrap_robot{
      margin-top: 30px;
      height: calc(100% - 233px);
    }
  }
}
</style>