<template>
  <div class="wrapper">
    <header>
      <img src="../assets/clock.svg">
      <strong>提现申请已提交</strong>
      <p class="time-tip">预计2小时内到账，具体以银行到账时间为准</p>
      <!-- <p class="trade-tip">当日交易金额与往日交易金额会分笔到账</p> -->
    </header>
    <ul>
      <li><span>储蓄卡</span><em>{{bankName}} 尾号{{bankAccount}}</em></li>
      <li><span>提现金额</span><em>￥{{cash | formatCurrencyStr}}</em></li>
      <!-- <li class="info"><span>当日交易金额<em class="orange">(费率0.1%)</em></span><em>￥{{todayBalance | formatCurrency}}</em></li>
      <li class="info"><span>往日交易金额<em>(免手续费)</em></span><em>￥{{yesterdayBalance | formatCurrency}}</em></li> -->
      <li><span>手续费</span><em>￥0.00</em></li>
      <li><span>预计到账金额</span><em>￥{{cash | formatCurrencyStr}}</em></li>
    </ul>
    <footer>
      <button @click="goRecordList()" class="secondary-button btn" type="button">查看提现记录</button>
      <button @click="goBalance()" class="default-button btn" type="button">完成</button>
    </footer>
    <loading :visible="isLoading"></loading>
  </div>
</template>
<script>
  import config from 'methods/config'
  import loading from 'components/loading/loading.vue'
  import bridge from 'methods/bridge-v2'
  export default {
    data () {
      return {
        cash: 0,
        fee: 0,
        yesterdayBalance: 0,
        bankName: '',
        bankAccount: '',
        isLoading: false
      }
    },
    components: {
      loading
    },
    computed: {
      // 实际到账金额
      actualFee () {
        return this.cash - this.fee
      },
      todayBalance () {
        return this.cash - this.yesterdayBalance
      }
    },
    created () {
      bridge.setNavTitle({
        title: '提现详情'
      })
      let query = this.$route.query
      this.cash = query.cash
      this.fee = query.fee
      this.bankName = query.bankName
      this.bankAccount = query.bankAccount
    },
    methods: {
      goBalance () {
        this.$router.push({name: 'index'})
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

  .wrapper {
    font-size: 30px;
  }

  header {
    text-align: center;
    padding: 36px 30px 30px;
    img {
      width: 116px;
      margin-bottom: 30px;
    }
    strong {
      display: block;
    }
    .time-tip {
      font-size: 24px;
      margin-bottom: 36px;
      margin-top: 24px;
      color: $aluminium;
    }
    .trade-tip {
      color: $orange;
      border: 2px dashed $orange;
      border-radius: 4px;
      line-height: 3;
      background-color: #fff;
    }
  }

  ul {
    border-top: 2px solid $lightGray;
    background-color: #fff;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 90px;
      padding: 0 30px;
      border-bottom: 2px solid $lightGray;
      &.info {
        background-color: #F7F7F7;
      }
    }
    span, em {
      display: block;
    }
    span {
      color: $aluminium;
      em {
        display: inline;
        font-size: 24px;
        margin-left: 8px;
        &.orange {
          color: $orange;
        }
      }
    }
  }

  footer {
    padding: 45px 30px;
    display: flex;
    justify-content: space-between;
    button {
      height: 88px;
      width: 48%;
      display: block;
    }
  }
</style>
