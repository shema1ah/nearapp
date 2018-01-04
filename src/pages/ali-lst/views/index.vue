<template lang="html">
  <div class="wrapper">
    <img src="../assets/logo.png" alt="">
    <p>快速进货服务由阿里巴巴旗下零售通提供。为了保证您有更好的进货体验和售后服务，将会获取您的部分商户信息授权给零售通使用，如店铺名称、店铺地址、经营信息等。</p>
    <p class="agreement">
      <input checked id="agreementCheckbox" @change="checkedBox($event)" type="checkbox"/>
      <span>确认授权表示同意<a href="https://s.qfpay.com.cn/docs/32bead2b3a0c739de218a546385d6cf2.html">《用户授权协议》</a></span>
    </p>
    <button class="modify-btn" type="button" :disabled="isDisabled" @click="submit()">确定</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import utils from 'methods/util'

  export default {
    data () {
      return {
        isDisabled: false,
        value: true
      }
    },
    created () {
      utils.setTitle('用户授权')
    },
    methods: {
      submit() {
        this.$router.push({name: 'form'})
      },
      checkedBox: function (e) {
        this.isDisabled = !e.target.checked
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  @import "../../../styles/base/var.scss";
  .wrapper {
    background-color: $white;
    border-top: 2px solid $lightGray;
    border-bottom: 2px solid $lightGray;
    margin-top: 30px;
    padding: 60px 30px 200px;
    height: calc(100vh - 30px);
    box-sizing: border-box;
    img {
      width: 50%;
      display: block;
      margin: 0 auto 30px;
    }
    p {
      font-size: 30px;
    }
    .agreement {
      margin-top: 60px;
      padding-top: 20px;
      color: #606470;
      line-height: 3;
      border-top: 2px dashed $lightGray;
      a {
        color: #000;
      }
    }
  }
  input[type='checkbox'], span {
    vertical-align: middle;
  }
  input[type='checkbox'] {
    width: 36px;
    height: 36px;
    margin-right: 8px;
    cursor: pointer;
    border: 2px solid #979797;
    appearance: none;
    outline: none;
    background-color: #fff;
    border-radius: 100%;
    &:checked {
      border: none;
      background: #ff8100 url("../assets/checked.svg") no-repeat center center;
      background-size: 62% 100%;
    }
  }
  .modify-btn {
    border-radius: 6px;
  }
</style>
