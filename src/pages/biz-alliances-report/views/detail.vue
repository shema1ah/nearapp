<template lang="html">
  <div class="wrapper">
    <div class="info">
      <header>
        <h1>联盟活动名称名称</h1>
        <span>进行中</span>
      </header>
      <div class="body">
        <h3>刺激消费</h3>
        <strong>1890000.00元</strong>
        <div>
          <span>核销总数<em>10<sub>个</sub></em>
          </span><span>优惠金额<em>2150.00<sub>元</sub></em>
          </span><span @click="tip()">推广费用<img src="../assets/warn-gray.svg"><em>100.00<sub>元</sub></em></span>
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
        <tr>
          <td>
            2018/03/08<br>
            12:30:59
          </td>
          <td>150.00</td>
          <td>5.00</td>
          <td>5.00</td>
        </tr>
        <tr>
          <td>
            2018/03/08<br>
            12:30:59
          </td>
          <td>150.00</td>
          <td>5.00</td>
          <td>5.00</td>
        </tr>
      </tbody>
    </table>
    <button type="button" class="fixed-bottom-btn">下载报表</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from 'methods/util'
  export default {
    data () {
      return {
      }
    },
    created () {
      utils.setTitle('活动详情')
    },
    methods: {
      tip() {
        this.$messagebox({
          title: '推广费用=(刺激消费/优惠金额 ) * 抽佣比例',
          confirmButtonText: '我知道了'
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  @import "../../../styles/base/var.scss";
  @import "../../../styles/base/layout.scss";
  .wrapper {
    background-color: #FFF1D9;
    padding-top: 20px;
  }
  .info {
    background-color: #fff;
    margin: 0 18px 24px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    header {
      border-radius: 8px 8px 0 0;
      padding: 24px 0 24px 26px;
      margin-bottom: 45px;
      border-bottom: 2px dashed #F0F0F0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      h1 {
        font-size: 30px;
        font-weight: normal;
      }
      span {
        font-size: 20px;
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
          bottom: -8px;
          content: ' ';
          width: 0;
          height: 0;
          border-width: 4px;
          border-style: solid;
          border-color: #D46C02 transparent transparent #D46C02;
        }
      }
    }
    .body {
      font-size: 26px;
      text-align: center;
      padding-bottom: 36px;
      h3 {
        font-size: 24px;
        font-weight: normal;
        color: $lightBlack;
      }
      strong {
        font-size: 46px;
        color: $orange;
      }
      div {
        margin-top: 30px;
        font-size: 24px;
        color: $lightBlack;
        span {
          display: inline-block;
          width: 33%;
          box-sizing: border-box;
          border-right: 2px solid $lightGray;
          &:last-child {
            padding-right: 0;
            margin-right: 0;
            border-right: none;
          }
          img {
            vertical-align: text-bottom;
            margin-left: 8px;
          }
        }
        em {
          color: #000;
          font-weight: bold;
          font-size: 28px;
          display: block;
          margin-top: 6px;
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
    font-size: 24px;
    border-collapse: collapse;
    color: $lightBlack;
    tr {
      border-bottom: 2px solid $lightGray;
    }
    thead {
      background-color: #F7F7F7;
      tr {
        height: 64px;
        border-top: 2px solid $lightGray;
      }
      td:first-child {
        text-align: left;
        padding-left: 36px;
      }
    }
    tbody {
      background-color: #fff;
      td {
        padding: 10px 0;
        &:first-child {
          text-align: left;
          padding-left: 36px;
        }
      }
    }
  }
</style>
