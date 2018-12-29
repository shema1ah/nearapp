<template>
  <div class="wrapper">
    <ul class="container">
      <li class="item">
        <em>手机号</em>
        <input type="tel" v-model="mobile" placeholder="请输入登录手机号">
      </li>
      <li class="item">
        <em>验证码</em>
        <input type="tel" v-model="code" placeholder="请输入短信验证码">
        <button type="button" v-if="codeWaiting" disabled class="disabled-button">60s</button>
        <button type="button" v-else @click="sendCode()" class="secondary-button" :style="'color:' + bgColor + ';border-color:' + bgColor">获取验证码</button>
      </li>
      <li class="item password">
        <em>设置新密码</em>
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="请输入新密码">
        <img v-if="showPassword" @click="togglePassword()" src="./img/icon-show.png">
        <img v-else @click="togglePassword()" src="./img/icon-hide.png">
      </li>
    </ul>
    <button class="modify-btn" :disabled="isDisabled" :style="'background-color:' + bgColor" type="button" @click="submit()">提交</button>
  </div>
</template>

<script>
import bridge from 'methods/bridge'
import { Indicator } from 'qfpay-ui'
import config from 'methods/config'

export default {
  data () {
    return {
      mobile: '',
      code: '',
      password: '',
      showPassword: false,
      isDisabled: false,
      bgColor: '#3971E0',
      codeWaiting: false
    }
  },
  created () {
    let ua = navigator.userAgent
    let bggroupid = /bggroupid/.test(ua) ? ua.match(/bggroupid:(.*)(\/|\s)/)[1] : 'haojin'
    this.bgColor = this.getBgColor(bggroupid)
  },
  methods: {
    getBgColor (bggroupid) {
      switch (bggroupid) {
        case 'xcydsh':
          return '#EF8C3C'
        default:
          return '#3971E0'
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    sendCode() {
      let mobileReg = /(^(0\d{2,3}(-)?){1}\d{7,8})(-\d{3,5})?$|^1[23456789]\d{9}$/
      if (!this.mobile.match(mobileReg)) {
        this.$toast('请输入正确的手机号')
        return
      }
      this.$http({
        url: `${config.oHost}mchnt/smscode/send`,
        method: 'GET',
        params: {
          mobile: this.mobile,
          mode: 'reset_pwd',
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          this.codeWaiting = true
        } else {
          this.codeWaiting = false
          this.$toast(res.respmsg)
        }
      }).catch(() => {
        this.codeWaiting = false
        this.$toast('网络错误，请重试')
      })
    },
    submit() {
      if (!this.mobile) {
        this.$toast('请输入手机号')
        return false
      }
      if (!this.code) {
        this.$toast('请输入验证码')
        return false
      }
      if (!this.password) {
        this.$toast('请输入密码')
        return false
      }
      this.isDisabled = true
      this.$Indicator.open()
      this.$http({
        url: `${config.oHost}mchnt/user/reset_pwd`,
        method: 'POST',
        params: {
          mobile: this.mobile,
          code: this.code,
          password: this.password,
          format: 'cors'
        }
      }).then(response => {
        this.isDisabled = false
        this.$Indicator.close()
        let res = response.data
        if (res.respcd === '0000') {
          bridge.logout()
        } else {
          this.$toast(res.resperr)
        }
      })
    }
  }
}
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
@import "../../styles/base/reset";
@import "../../styles/base/form";
@import "../../styles/base/qfpay-ui";
body {
  background-color: #f7f7f7;
  padding-top: 16px;
}
.container {
  background-color: #fff;
  border-top: 2px solid #E5E5E5;
  border-bottom: 2px solid #E5E5E5;
  padding-left: 30px;
}
.item {
  font-size: 30px;
  padding: 24px 30px 24px 0;
  border-bottom: 2px solid #E5E5E5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:last-child {
    border-bottom: none;
  }
  em, input {
    display: block;
  }
  em {
    font-style: normal;
    color: #606470;
  }
  input {
    text-align: right;
    border: none;
    outline: none;
    flex: 1;
    font-size: inherit;
    &::placeholder {
      color: #A7A9AE;
    }
  }
}
.password {
  img {
    width: 38px;
    margin-left: 20px;
  }
}
.secondary-button {
  cursor: pointer;
  border-radius: 5px;
  margin-left: 20px;
}
.disabled-button {
  color: #fff;
  font-size: 12px;
  border-radius: 5px;
  margin-left: 20px;
  padding: 8px 15px;
  background-color: #A7A9AE;
}
.modify-btn {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  cursor: pointer;
  padding: 0;
  height: 90px;
  border: none;
  background-color: #A7A9AE;
  color: #fff;
  font-size: 32px;
}
</style>
