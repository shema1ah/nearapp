<template>
  <div class="wrapper">
    <header>
      <div>
        <span>提现金额：</span><strong><sub>￥</sub>{{record.cashout_amount | formatCurrency}}</strong>
      </div>
      <span :class="{'succeed': record.status === 'S', 'failed': record.status === 'F', 'pending': record.status === 'P'}">{{statusText(record.status)}}</span>
    </header>
    <div class="content">
      <!-- <p><span>资金类型：</span>{{record.cashout_type === 1 ? '当日交易资金' : '往日交易资金'}}</p> -->
      <p><span>提现银行：</span>{{record.bank_name}}</p>
      <p><span>提现卡号：</span>{{record.bank_account}}</p>
      <p><span>提现时间：</span>{{record.datetime}}</p>
      <p><span>交易单号：</span>{{record.trans_seq_id }}</p>
      <p><span>提现手续费：</span>0</p>
      <!-- <p><span>提现手续费：</span><sub>￥</sub>{{record.cashout_fee | formatCurrency}}</p> -->
    </div>
  </div>
</template>
<script>
  import bridge from 'methods/bridge-v2'
  export default {
    data () {
      return {
        record: {}
      }
    },
    created () {
      bridge.setNavTitle({
        title: '提现详情'
      })
      this.record = JSON.parse(this.$route.query.record)
    },
    methods: {
      statusText(status) {
        switch (status) {
          case 'S':
            return '提现成功'
          case 'P':
            return '提现处理中'
          case 'F':
            return '提现失败'
        }
      }
    }
  }
</script>
<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  @import "../../../styles/base/var";

  .wrapper {
    font-size: 30px;
    padding-top: 24px;
  }

  header, .content {
    background-color: #fff;
    border-top: 2px solid $lightGray;
    border-bottom: 2px solid $lightGray;
  }

  header {
    color: $black;
    height: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    margin-bottom: 24px;
    div {
      span {
        color: $aluminium;
      }
      span, strong {
        vertical-align: middle;
      }
    }
    strong {
      font-size: 50px;
      sub {
        font-size: 75%;
      }
    }
    span {
      &.failed {
        color: #FF3D1F;
      }
      &.succeed {
        color: #71D321;
      }
      &.pending {
        color: $orange;
      }
    }
  }

  .content {
    padding: 18px 30px;
    p {
      line-height: 2;
    }
    span {
      color: $aluminium;
    }
    sub {
      font-size: 75%;
    }
  }
</style>
