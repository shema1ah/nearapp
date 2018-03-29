<template>
  <div class="wrapper">
    <p class="tips">我们会于1小时内，发送报表到您的邮箱，请您填写正确的邮箱地址</p>
    <div class="input-cage">
      <label for="email">邮箱</label><input id="email" type="text" v-model="email">
    </div>
    <button :disabled="isPending" @click="sendEmail()" type="button" class="fixed-bottom-btn">发送</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import bridge from 'methods/bridge-v2'
  import config from 'methods/config'
  import { Toast, Indicator } from 'qfpay-ui'
  export default {
    data () {
      return {
        email: '',
        isPending: false
      }
    },
    created () {
      bridge.setNavTitle({
        title: '下载报表',
        color: '#000000',
        bgcolor: '#ffffff'
      })
    },
    methods: {
      sendEmail() {
        if (!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(this.email)) {
          this.$toast('邮箱格式错误')
          return false
        }
        this.isPending = true
        Indicator.open()
        this.$http({
          url: `${config.oHost}mchnt/commission/detail`,
          method: 'GET',
          params: {
            actid: this.$route.params.actvId,
            email: this.email,
            format: 'cors'
          }
        }).then(response => {
          Indicator.close()
          this.isPending = false
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
  line-height: 1.4;
  padding: 24px 30px;
}
.input-cage {
  padding: 0 30px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  font-size: 30px;
  color: #000;
  input {
    appearance: none;
    flex: 1;
    -webkit-flex: 1;
    display: block;
    font-size: 30px;
    height: 70px;
    padding-left: 24px;
    margin-left: 20px;
    border: 2px solid #D8D8D8;  /*px*/
    border-radius: 6px;
    &::placeholder {
      color: #D8D8D8;
    }
  }
}
button {
  &:disabled {
    background-color: $gray;
  }
}
</style>
