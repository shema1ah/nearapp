<template>
  <div class="balance-wrapper" v-show="visible">
    <header>
      <img src="../assets/wallet.svg">
      <span>我的账户余额</span>
      <strong>￥{{balance | formatCurrencyStr | formatCurrencyThree}}</strong>
    </header>
    <div class="container">
      <p class="time-tip">提现业务受理时间:　09:00-15:00</p>
      <button type="button" @click="goInputFee()" class="default-button btn">提现</button>
      <p class="record" @click="goRecordList()">
        <img class="file" src="../assets/doc.svg">
        <span>提现记录</span>
        <img class="arrow" src="../assets/arrow-right.svg">
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['visible', 'balance'],
    data () {
      return {
      }
    },
    methods: {
      goInputFee () {
        this.$emit('hideBalance')
      },
      goRecordList () {
        this.$router.push({name: 'list'})
      }
    }
  }
</script>
<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  @import "../../../styles/base/form";
  @import "../../../styles/base/var";

  .balance-wrapper {
    font-size: 30px;
    text-align: center;
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  header {
    padding-top: 120px;
    img {
      width: 180px;
      height: 180px;
      margin-bottom: 60px;
    }
    span, strong {
      display: block;
    }
    span {
      margin-bottom: 36px;
    }
    strong {
      font-size: 88px;
      font-weight: bold;
    }
  }

  .container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 30px;
    .time-tip {
      color: $aluminium;
      font-size: 24px;
    }
    button {
      width: 100%;
      font-size: 34px;
      height: 88px;
      margin: 36px 0 45px;
    }
    .record {
      color: $lightBlack;
      padding-bottom: 120px;
      cursor: pointer;
      img, span {
        vertical-align: middle;
        display: inline-block;
      }
      .file {
        height: 0.4rem;
      }
      .arrow {
        height: 0.3rem;
      }
    }
  }

</style>
