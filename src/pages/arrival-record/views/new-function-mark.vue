<template lang="html">
  <div class="mark-wrap">
    <div class="content-wrap">
      <img class="img-star" src="../assets/img_star.png" alt="">
      <div class="tips-wrap">
        <img class="graphics left-graphics" src="../assets/left_graphics.png" alt="">
        <div class="tips-center-wrap">
          <div class="tips-center-wrap_header">新功能上线</div>
          <div class="tips-center-wrap_content">
            <p class="tips-title">功能特性</p>
            <ul class="tips-list">
              <li class="tips-list-item">交易实时入账</li>
              <li class="tips-list-item">提现5-10分钟到账</li>
              <li class="tips-list-item">自动划款变更为自动提现和手动提现</li>
            </ul>
            <div class="agreement-wrap">
              <van-checkbox v-model="checked" checked-color="#FF8100"></van-checkbox>
              <p class="agreement-wrap_text">我已阅读并同意<span @click="goAgreement">《钱方用户自动提现授权协议书》</span></p>
            </div>
            <div class="close-btn" @click="closeMark">好的</div>
          </div>
        </div>
        <img class="graphics right-graphics" src="../assets/right_graphics.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewFunctionMark',
  data () {
    return {
      checked: true
    }
  },
  methods: {
    goAgreement() {
      window.location = 'https://s.qfpay.com/h5/text/zdtxsqxy.html'
    },
    closeMark() {
      if (this.checked) {
        this.$emit('close')
      } else {
        this.$toast('请勾选协议')
      }
    }
  }
}
</script>

<style type="text/ecmascript-6">
.mark-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.85);
}
.content-wrap {
  padding: 220px 30px 0;
  text-align: center;
}
.img-star {
  width: 348px;
}
.tips-wrap {
  width: 690px;
  position: relative;
  margin: 20px auto 0;
}
.graphics {
  display: inline-block;
  width: 50px;
  position: absolute;
  top: 28px;
}
.left-graphics {
  left: 0;
}
.right-graphics {
  right: 0;
}
.tips-center-wrap {
  width: 590px;
  margin: 0 auto;
  border-radius: 6px;
  overflow: hidden;
}
.tips-center-wrap_header {
  height: 90px;
  font-size: 40px;
  text-align: center;
  line-height: 90px;
  color: #fff;
  background: linear-gradient(60deg, #FFC800 , #FF8100);
}
.tips-center-wrap_content {
  background-color: #fff;
  padding: 30px 30px;
}
.tips-title {
  font-size: 34px;
}
.tips-list {
  padding-top: 20px;
  padding-bottom: 30px;
  padding-left: 20px;
  text-align: left;
  border-bottom: 2px dashed #D8D8D8;
}
.tips-list-item {
  font-size: 30px;
  color: #606470;
  position: relative;
}
.tips-list-item::before {
  content: '.';
  font-size: 72px;
  position: absolute;
  left: -28px;
  top: -50px;
}
.agreement-wrap {
  padding: 30px 0;
  font-size: 30px;
  color: #666666;
  display: flex;
}
.van-checkbox {
  width: 60px;
  height: 40px;
}
.van-checkbox__icon {
  font-size: 40px;
}
.agreement-wrap_text {
  display: inline-block;
  text-align: left;
  margin-left: 12px;
  text-align:justify;
}
.agreement-wrap_text > span {
  color: #FF8100;
}
.close-btn {
  height: 88px;
  line-height: 88px;
  font-size: 34px;
  color: #fff;
  background-color: #FF8100;
  border-radius: 8px;
}
</style>
