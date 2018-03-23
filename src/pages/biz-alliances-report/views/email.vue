<template>
  <div class="wrapper">
    <p class="tips">我们会于1小时内，发送报表到您的邮箱，请您填写邮箱地址</p>
    <div class="input-cage">
      <label for="email">邮箱</label><input id="email" type="text" v-model="email" placeholder="liu******@163.com">
    </div>
    <button @click="sendEmail()" type="button" class="fixed-bottom-btn">发送</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  export default {
    data () {
      return {
        email: ''
      }
    },
    created () {

    },
    methods: {
      sendEmail() {
        this.$http({
          // todo 换线上
          url: `${config.host}mchnt/commission/detail`,
          method: 'GET',
          params: {
            actid: this.$route.params.actvId,
            email: this.email,
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            this.$toast('发送成功')
          } else {
            this.$toast(res.respmsg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped rel="stylesheet/scss">
@import "../../../styles/base/var.scss";
@import "../../../styles/base/layout.scss";
.tips {
  color: $lightBlack;
  font-size: 30px;
  padding: 24px 30px;
}
.input-cage {
  padding-left: 30px;
  font-size: 30px;
  color: #000;
  input {
    font-size: 30px;
    height: 70px;
    width: 76%;
    padding-left: 12px;
    margin-left: 20px;
    border: 2px solid #D8D8D8;
    border-radius: 6px;
    &::placeholder {
      color: #D8D8D8;
    }
  }
}
</style>
