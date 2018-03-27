<template lang="html">
  <div class="wrapper">
    <div class="info">
      <div class="inner">
        <header>
          <h1>{{actvInfo.actname}}</h1>
          <span :class="{'active': actvInfo.status, 'cancel': !actvInfo.status}">{{actvInfo.status ? '进行中' : '已结束'}}</span>
        </header>
        <div class="body">
          <h3>刺激消费</h3>
          <strong>{{actvInfo.total_amount | formatCurrency}}<sub>元</sub></strong>
          <div>
            <span>核销总数<em>{{actvInfo.total_num}}<sub>个</sub></em>
            </span><span>优惠金额<em>{{actvInfo.coupon_amount | formatCurrency}}<sub>元</sub></em>
            </span><span @click="tip()"><span>推广费用</span><img src="../assets/warn-gray.svg"><em>{{actvInfo.commission_amount | formatCurrency}}<sub>元</sub></em></span>
          </div>
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <td width="25%">交易时间</td>
          <td width="25%">刺激消费</td>
          <td width="25%">优惠金额</td>
          <td width="25%">推广费用</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in actvInfo.records" :class="{'cancel': record.trade_status === 3}">
          <td>{{record.trade_time}}</td>
          <td>{{record.trade_amount | formatCurrency}}</td>
          <td>{{record.coupon_amount | formatCurrency}}</td>
          <td>{{record.commi_amount | formatCurrency}}</td>
        </tr>
      </tbody>
    </table>
    <div class="placeholder"></div>
    <button @click="goEmail()" type="button" class="fixed-bottom-btn">下载报表</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import bridge from 'methods/bridge-v2'
  import config from 'methods/config'
  import utils from 'methods/util'
  export default {
    data () {
      return {
        actvInfo: {}
      }
    },
    created () {
      let actvId = this.$route.params.actvId
      this.getData(actvId)
      utils.setTitle('活动详情')
      bridge.setNavTitle({
        title: '活动详情',
        color: '#000000',
        bgcolor: '#ffffff'
      })
    },
    methods: {
      tip() {
        this.$messagebox({
          title: '推广费用 = 刺激消费 * ' + this.actvInfo.rate / 100,
          confirmButtonText: '我知道了'
        })
      },
      getData (actvId) {
        this.$http({
          url: `${config.oHost}mchnt/commission/detail`,
          method: 'GET',
          params: {
            actid: actvId,
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            this.actvInfo = res.data
          } else {
            this.$toast(res.respmsg)
          }
        })
      },
      goEmail () {
        this.$router.push({ name: 'email' })
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  @import "../../../styles/base/var.scss";
  @import "../../../styles/base/layout.scss";
  .info {
    padding: 24px 18px 24px;
    background-color: #FFF1D9;
    .inner {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    header {
      border-radius: 8px 8px 0 0;
      padding: 24px 0 24px 26px;
      border-bottom: 2px dashed #e2e2e2;  /*px*/
      display: flex;
      align-items: center;
      -webkit-align-items: center;
      justify-content: space-between;
      -webkit-justify-content: space-between;
      h1 {
        font-size: 30px;
        font-weight: normal;
      }
      span {
        font-size: 26px;
        font-weight: 300;
        background-color: #FF8100;
        color: #fff;
        padding: 0 16px 0 20px;
        height: 42px;
        line-height: 44px;
        margin-right: -8px;
        border-radius: 20px 0 0 20px;
        position: relative;
        &:after {
          position: absolute;
          z-index: 1;
          right: 0;
          bottom: -10px;
          content: ' ';
          width: 10px;
          height: 10px;
          background: url('../assets/triangle.png') no-repeat;
          background-size: 100% auto;
        }
        &.active {
          background-color: #FF8100;
        }
        &.cancel {
          background-color: #A7A9AE;
          &:after {
            background: url('../assets/triangle-gray.png') no-repeat;
          }
        }
      }
    }
    .body {
      font-size: 26px;
      text-align: center;
      padding-top: 45px;
      padding-bottom: 36px;
      h3 {
        font-size: 26px;
        font-weight: normal;
        color: $lightBlack;
        margin-bottom: 20px;
      }
      strong {
        line-height: 1;
        font-size: 60px;
        font-weight: bold;
        color: $orange;
        sub {
          vertical-align: 20%;
          font-size: 50%;
          font-weight: normal;
          margin-left: 6px;
        }
      }
      div {
        margin-top: 40px;
        font-size: 24px;
        color: $lightBlack;
        > span {
          display: inline-block;
          width: 33%;
          box-sizing: border-box;
          border-right: 2px solid $lightGray;  /*px*/
          &:last-child {
            padding-right: 0;
            margin-right: 0;
            border-right: none;
          }
          span, img {
            vertical-align: middle;
          }
          img {
            width: 26px;
            height: 26px;
            margin-left: 8px;
          }
        }
        em {
          color: #000;
          font-weight: bold;
          font-size: 30px;
          display: block;
          margin-top: 20px;
          sub {
            vertical-align: 1px;
            margin-left: 6px;
          }
        }
      }

    }
  }
  table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    color: $lightBlack;
    tr {
      border-bottom: 2px solid #f0f0f0;  /*px*/
    }
    thead {
      background-color: #F7F7F7;
      font-size: 26px;
      tr {
        height: 72px;
        border-top: 2px solid $lightGray;  /*px*/
      }
      td:first-child {
        text-align: left;
        padding-left: 36px;
      }
    }
    tbody {
      background-color: #fff;
      font-size: 30px;
      tr {
        height: 90px;
        &.cancel {
          background-color: #FBFBFB;
          color: #C2C2C2;
        }
      }
      td {
        padding: 10px 0;
        &:first-child {
          font-size: 24px;
          line-height: 1.4;
          text-align: left;
          padding-left: 36px;
        }
      }
    }
  }
  .placeholder {
    height: 100px;
  }
</style>
