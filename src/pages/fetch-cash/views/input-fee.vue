<template>
  <div class="wrapper">
    <header>
      <strong>到账银行卡</strong><span>{{bankName}}</span>
    </header>
    <form class="cash-form">
      <div>
        <h3>提现金额</h3>
        <label>
          <span>￥</span>
          <input type="number" :class="{'hasInput': cash > 0}" v-model="cash_format" debounce="600">
        </label>
        <p v-show="isOverRang" class="error">输入金额超过账户余额</p>
        <p v-show="!isOverRang">总余额 ￥{{balance | formatCurrencyStr | formatCurrencyThree}}<span @click="inputAll()">全部提现</span></p>
      </div>
      <footer>
        <p><span>*</span>余额提现免手续费、且每天最多可提现3次</p>
        <button @click="confirmFetchCash()" type="button" class="default-button btn" :disabled="cash === 0 || isOverRang">提现</button>
        <p style="text-align:center">预计2小时内到账，具体以银行到账时间为准</p>
      </footer>
    </form>
    <!-- <loading :visible="isLoading"></loading> -->
    <balance :balance="balance" :visible="showBalance" @hideBalance="hideBalance"></balance>
  </div>
</template>
<script>
  import config from 'methods/config'
  // import loading from 'components/loading/loading.vue'
  import balance from './balance.vue'
  import { MessageBox } from 'qfpay-ui'
  import bridge from 'methods/bridge-v2'
  export default {
    data () {
      return {
        cash: 0, // 提现金额
        feeRate: 0, // 手续费率
        balance: 0, // 总余额
        yesterdayBalance: 0, // 往日余额
        bankName: '',
        showBalance: true, // true,
        visibleConfirm: false
      }
    },
    components: {
      balance
    },
    beforeRouteEnter (to, from, next) {
      bridge.setNavTitle({
        title: '账户余额'
      })
      next()
    },
    created () {
      this.fetchBalance()
      // this.getFeeRate()
    },
    computed: {
      cash_format: {
        get: function () {
          return this.cash / 100 || ''
        },
        set: function (value) {
          this.cash = value * 100 || ''
        }
      },
      isOverRang () {
        return this.cash > this.balance
      }
    },
    methods: {
      hideBalance () {
        bridge.setNavTitle({
          title: '余额提现'
        })
        this.showBalance = false
      },
      inputAll () {
        this.cash = this.balance
      },
      fetchBalance () {
        this.$Indicator.open()
        this.$http({
          url: `${config.o2Host}withdraw/v1/wallet/balance`,
          method: 'GET',
          params: {
            format: 'cors'
          }
        }).then((res) => {
          this.$Indicator.close()
          if (res.data.respcd === '0000') {
            let data = res.data
            let bankAccount = data.data.bank_account
            let bankName = data.data.bank_name
            bankAccount = bankAccount.substring(bankAccount.length - 4, bankAccount.length)
            this.bankName = `${bankName}(${bankAccount})`
            this.balance = data.data.available_amount
          } else {
            this.$toast(res.data.resperr)
          }
        })
      },
      getFeeRate() {
        this.$Indicator.open()
        this.$http({
          url: `${config.oHost}withdraw/v1/wallet/fee_rate`,
          method: 'GET',
          params: {
            format: 'cors'
          }
        }).then((res) => {
          this.$Indicator.close()
          if (res.data.respcd === '0000') {
            this.feeRate = res.data.data.fee_rate
          } else {
            this.$toast(res.data.resperr)
          }
        })
      },
      confirmFetchCash () {
        let _this = this
        if (this.cash) {
          MessageBox({
            title: '是否确定提现？',
            message: `￥${_this.cash / 100}`,
            showCancelButton: true
          }).then(action => {
            if (action === 'confirm') {
              this.fetchCash()
            }
          })
        }
      },
      fetchCash() {
        this.$Indicator.open()
        this.$http({
          url: `${config.o2Host}withdraw/v1/wallet/cash`,
          method: 'POST',
          params: {
            fee_rate: this.feeRate, // 手续费率
            cashout_amount: this.cash, // 提现金额
            format: 'cors'
          }
        }).then((res) => {
          this.$Indicator.close()
          if (res.data.respcd === '0000') {
            this.$router.push({
              name: 'predone',
              query: {
                cash: this.cash,
                fee: 0,
                bankName: this.bankName
              }
            })
          } else {
            this.$toast(res.data.resperr)
          }
        })
      }
    }
  }
</script>
<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  @import "../../../styles/base/form";
  @import "../../../styles/base/var";

  .wrapper {
    font-size: 30px;
    padding-top: 24px;
  }
  header {
    background-color: #fff;
    border-top: 2px solid $lightGray;
    border-bottom: 2px solid $lightGray;
    color: $black;
    height: 120px;
    line-height: 120px;
    padding-left: 30px;
    margin-bottom: 24px;
    span {
      color: $orange;
      margin-left: 40px;
    }
  }
  .cash-form {
    div {
      padding: 0 30px;
      background-color: #fff;
      border-top: 2px solid $lightGray;
      border-bottom: 2px solid $lightGray;
      h3 {
        padding-top: 24px;
      }
      label {
        margin: 40px 0;
        display: block;
        span {
          font-size: 52px;
        }
        span, input {
          vertical-align: middle;
        }
        input {
          border: none;
          outline: none;
          font-size: 48px;
          width: 70%;
          padding-left: 0;
          background: url('../assets/input-bg.png') no-repeat left center;
          background-size: auto 30px;
          &.hasInput {
            background: none;
          }
          &:focus {
            border: none;
            outline: none;
            background: none;
          }
          &::placeholder {
            color: $gray;
          }
        }
      }
      p {
        &.error {
          color: #ff3d1f;
        }
        padding: 24px 0;
        border-top: 2px solid $lightGray;
        span {
          margin-left: 30px;
        }
      }
    }
    button {
      width: 100%;
      height: 88px;
      margin-top: 30px;
      font-size: 34px;
      cursor: pointer;
      &:disabled {
        background-color: #a7a9ae;
      }
    }
    footer {
      padding: 0 30px;
      p {
        margin-top: 20px;
        font-size: 24px;
        span {
          margin-right: 6px;
        }
      }
    }
    p {
      color: $aluminium;
      line-height: 1.5;
      span {
        color: $orange;
      }
    }
  }
</style>
