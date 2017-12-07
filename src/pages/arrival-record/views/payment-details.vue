<template lang="html">
  <div class="container_box" v-if="hasdata">
    <div class="money">
      <span>￥</span>
      <span>{{data.amt}}</span>
    </div>
    <ul class="detail_list">
      <li>
        <p>收款时间</p>
        <p>{{data.ctime}}</p>
      </li>
      <li>
        <p>交易笔数</p>
        <p>{{data.num}}笔</p>
      </li>
      <li class="tab_list">
        <p>交易时间</p>
        <p>交易金额</p>
        <p>手续费</p>
      </li>
    </ul>
    <div class="details_title">
      <p>2017/11/20</p>
      <p>￥498.000</p>
      <p>-￥2.00</p>
    </div>
    <ul class="details">
      <li v-for="item in list">
        <p>
          <span></span>
          <span>{{item.trade_time}}</span>
        </p>
        <p>￥28.00</p>
        <p>-￥0.00</p>
      </li>
    </ul>
    <loading :visible='loading'></loading>
  </div>
</template>

<script>
import loading from '../../../components/loading/juhua.vue'
export default {
  data () {
    return {
      loading: false,
      hasdata: false,
      page: 1,
      data: {},
      list: []
    }
  },
  created () {
    this.loading = true
    this.detailRequest(this.$route.params.biz_sn)
  },
  components: {
    loading
  },
  methods: {
    detailRequest (bizSn) {
      this.$http({
        url: 'http://172.100.107.244:7200/fund/settle/details/',
        method: 'GET',
        params: {
          biz_sn: bizSn,
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          this.loading = false
          this.hasdata = true
          this.data = res.data
          this.listRequest(res.data.bat_id)
        } else {
          this.$toast(res.resperr)
        }
      })
    },
    listRequest (batId) {
      this.$http({
        url: 'http://172.100.107.244:7200/fund/trade/details/',
        method: 'GET',
        params: {
          settle_bat_id: batId,
          page: this.page,
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          this.list = this.list.concat(res.data.data)
        } else {
          this.$toast(res.resperr)
        }
      })
    }
  }
}
</script>

<style lang="scss" type="scss">
  @import "../../../styles/global.scss";
  body {
    background: #F7F7F7;
  }
  .container_box {
    margin-top: 30px;
    background: #fff;
    padding-top: 46px;
    .money {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FF8100;
      font-weight: 700;
      padding-bottom: 51px;
      span:first-of-type {
        font-size: 32px;
      }
      span:last-of-type {
        font-size: 46px;
      }
    }
    .detail_list {
      li {
        height: 88px;
        padding-right: 30px;
        margin-left: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #E5E5E5;
        p:first-of-type {
          font-size: 30px;
          color: #606470;
        }
        p:last-of-type {
          font-size: 32px;
          color: #000;
        }
      }
      li:nth-of-type(2) {
        border: none;
      }
      .tab_list {
        background: #F7F7F7;
        margin-left: 0;
        padding-left: 30px;
        border: none;
        p {
          font-size: 30px;
          color: #606470;
        }
        p:last-of-type {
          color: #606470;
        }
      }
    }
    .details_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 30px;
      height: 88px;
      border-bottom: 1px solid #E5E5E5;
      font-size: 32px;
    }
    .details {
      padding: 0 30px;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 88px;
        border-bottom: 1px solid #E5E5E5;
        p {
          color: #606470;
          font-size: 30px;
        }
        p:first-of-type span:first-of-type {
          display: inline-block;
          width: 48px;
          height: 48px;
          background: url('../assets/wechat_ic.png');
          background-size: 100% 100%;
          vertical-align: middle;
          margin-right: 16px;
        }
        p:first-of-type span:last-of-type {
          vertical-align: middle;
          font-size: 26px;
          color: #8A8C92;
        }
      }
    }
  }
</style>
