<template lang="html">
  <div class="container">
    <div class="top_container">
      <div class="bank">
        <p class="bank_icon"></p>
        <p class="bank_name">中国农业银行</p>
      </div>
      <div class="money">
        <span>￥</span>
        <span>100.00</span>
      </div>
    </div>
    <div class="bank_status">
      <p class="processes">
        <span class="processes_ing"></span>
        <span>银行处理中</span>
      </p>
      <div>
        <p class="line1"></p>
        <p class="line2"></p>
      </div>
      <p class="processes">
        <span class="processes_result"></span>
        <span>已划款</span>
      </p>
      <div class="tips_text">
        <p>
          <span>*</span>
          <span>正常情况下18:00之前到账，如未到账，请咨询您的发卡行。</span>
        </p>
        <!-- <p>
          <span>*</span>
          <span>银行处理中的文案</span>
        </p>
        <p>
          <span>*</span>
          <span>银行处理中的文案</span>
        </p> -->
      </div>
    </div>
    <ul class="detail_list">
      <li>
        <p>转入账户</p>
        <p>中国农业银行(6999)</p>
      </li>
      <li>
        <p>结算方式</p>
        <p>自动化款</p>
      </li>
      <li>
        <p>划款时间</p>
        <p>2017/11/22  16:34:59</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {
    this.request()
  },
  methods: {
    request () {
      this.$http({
        url: 'http://172.100.116.238:7200/fund/remit/details/',
        method: 'GET',
        params: {
          biz_sn: '6311829282792246994',
          format: 'cors'
        }
      })
    }
  }
}
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../../../styles/global.scss";
  body {
    background: #F7F7F7;
  }
  .container {
    margin-top: 30px;
    background: #fff;
    .top_container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 194px;
      .bank {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .bank_icon {
          width: 44px;
          height: 44px;
          background: url(../assets/bank_icon.png);
          background-size: 100% 100%;
          margin-right: 13px;
        }
        .bank_name {
          font-size: 30px;
          color: #000;
        }
      }
      .money {
        width: 100%;
        font-size: 46px;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-items: center;
        span:first-of-type {
          font-size: 32px;
        }
      }
    }
    .bank_status {
      margin: 0 30px 0 30px;
      height: 310px;
      background: #FBFBFB;
      box-sizing: border-box;
      border: 2px dashed #E5E5E5;
      border-radius: 6px;
      padding: 30px;
      .processes {
        display: flex;
        align-items: center;
        .processes_ing {
          display: inline-block;
          width: 42px;
          height: 42px;
          background: url(../assets/status_ic.png);
          background-size: 100% 100%;
          margin-right: 16px;
        }
        .processes_result {
          width: 42px;
          height: 42px;
          background: url('../assets/status_ic2.png');
          background-size: 100% 100%;
          margin-right: 16px;
        }
        span:last-of-type {
          font-size: 30px;
        }
      }
      >div .line1{
        width: 2px;
        height: 40px;
        background: #FF8100;
        margin: -2px 0 0 20px;
      }
      >div .line2 {
        width: 2px;
        height: 40px;
        background: #FF8100;
        margin-left: 20px;
      }
      .tips_text {
        margin-top: 20px;
        p {
          display: flex;
          span:first-of-type {
            color: #606470;
            font-size: 30px;
            margin-right: 8px;
          }
          span:last-of-type {
            color: #606470;
            font-size: 26px;
          }
        }
      }
    }
    .detail_list {
      padding-left: 30px;
      >li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 90px;
        border-bottom: 2px solid #E5E5E5;
        padding-right: 30px;
        p:first-of-type {
          color: #606470;
          font-size: 30px;
        }
        p:last-of-type {
          color: #000;
          font-size: 30px;
        }
      }
      >li:last-of-type {
        border-bottom: none;
      }
    }
  }
</style>
