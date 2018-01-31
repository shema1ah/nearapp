<template lang="html">
  <div class="wrapper" v-show="visible">
    <img src="../assets/lst-bg.png" alt="零售通logo"/>
    <div class="content">
      <p class="info">钱方好近与阿里巴巴旗下零售通合作提供进货服务。为保障您的体验，会将您的部分信息授权给零售通使用。</p>
      <p class="agreement">
        <input checked id="agreementCheckbox" @change="checkedBox($event)" type="checkbox"/>
        <span><label for="agreementCheckbox">确认授权表示同意</label><a href="https://s.qfpay.com.cn/docs/32bead2b3a0c739de218a546385d6cf3.html">《用户授权协议》</a></span>
      </p>
      <button class="modify-btn" type="button" :disabled="isDisabled" @click="submit()">确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        isDisabled: false,
        value: true
      }
    },
    computed: {
      visible() {
        return this.$parent.visible
      }
    },
    created () {
      if (!this.visible) {
        this.$Indicator.open()
      }
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
    height: 100vh;
    font-size: 26px;
    img {
      width: 100%;
      display: block;
    }
    .content {
      padding: 0 30px;
    }
    .info {
      color: #9B9B9B;
      padding-top: 20px;
    }
    .agreement {
      padding-left: 30px;
      font-size: 30px;
      margin-top: 40px;
      color: #606470;
      line-height: 3.5;
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
