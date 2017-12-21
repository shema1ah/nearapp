<template lang="html">
  <div class="container_box">
    <div class="loading_box" v-if="hasdata">
      <div class="Money">
        <span>￥</span>
        <span>{{data.amt | formatCurrencyStr | formatCurrencyThree}}</span>
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
        <p>{{trade_time | splitDate}}</p>
        <p><span>￥</span>{{(Number(amt) + Number(fee)) | formatCurrencyStr | formatCurrencyThree}}</p>
        <p>-<span>￥</span>{{fee | formatCurrency}}</p>
      </div>
      <ul class="details">
        <li v-for="item in list">
          <p>
            <img :src="tradeType(item.trade_type)" alt="">
            <span>{{item.trade_time | splitTime}}</span>
          </p>
          <p>￥{{item.amt | formatCurrencyStr | formatCurrencyThree}}</p>
          <p v-if="item.fee >= 0">-￥{{item.fee | formatCurrencyStr | formatCurrencyThree}}</p>
          <p v-if="item.fee < 0">￥{{Math.abs(item.fee) | formatCurrencyStr | formatCurrencyThree}}</p>
        </li>
      </ul>
    </div>
    <loading :visible='isloading'></loading>
    <div class="no_more" v-if="nomore">
      没有更多了...
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import loading from 'components/loading/juhua.vue'
import bridge from 'methods/bridge-v2'
import util from 'methods/util'
import config from 'methods/config'
import wechat from '../assets/ic_weixin.svg'
import alipay from '../assets/ic_zfb.svg'
import jdpay from '../assets/ic_jd.svg'
import card from '../assets/ic_card.png'
import qqpay from '../assets/ic_qq.svg'
import chuzhi from '../assets/ic_chuzhi.png'
export default {
  data () {
    return {
      isloading: false,
      hasdata: false,
      page: 1,
      data: {},
      list: [],
      amt: '',
      fee: '',
      trade_time: '',
      bat_id: '',
      nomore: 0,
      shopid: ''
    }
  },
  created () {
    this.shopid = this.$route.query.shopid
    this.detailRequest(this.$route.params.biz_sn)
  },
  components: {
    loading
  },
  filters: {
    splitDate (item) {
      let date = item.substring(0, 10)
      return date.replace(/-/g, '/')
    },
    splitTime (item) {
      return item.substr(11)
    }
  },
  mounted () {
    window.addEventListener('scroll', this.loadmore, false)
    // 禁掉下拉刷新功能
    this.pageRefresh()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.loadmore, false)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      util.setTitle('收款详情')
    })
  },
  methods: {
    detailRequest (bizSn) {
      this.isloading = true
      this.$http({
        url: `${config.oHost}/fund/v1/settle/details/`,
        method: 'GET',
        params: {
          biz_sn: bizSn,
          format: 'cors'
        }
      }).then(response => {
        this.isloading = false
        let res = response.data
        if (res.respcd === '0000') {
          this.hasdata = true
          this.data = res.data
          this.amt = res.data.amt
          this.fee = res.data.fee
          this.bat_id = res.data.bat_id
          this.listRequest(this.bat_id)
        } else {
          this.$toast(res.resperr)
        }
      })
    },
    listRequest (batId) {
      this.isloading = true
      this.$http({
        url: `${config.oHost}/fund/v1/trade/details/`,
        method: 'GET',
        params: {
          settle_bat_id: batId,
          page: this.page,
          shopid: this.shopid || '',
          format: 'cors'
        }
      }).then(response => {
        this.isloading = false
        let res = response.data
        if (res.respcd === '0000') {
          this.list = this.list.concat(res.data)
          this.trade_time = this.list[0].trade_time
          this.nomore = res.data.length ? 0 : 1
        } else {
          this.$toast(res.resperr)
        }
      })
    },
    tradeType (type) {
      switch (type) {
        case 'weixin':
          return wechat
        case 'alipay':
          return alipay
        case 'jdpay':
          return jdpay
        case 'card':
          return card
        case 'qqpay':
          return qqpay
        case 'prepaid':
          return chuzhi
      }
    },
    loadmore () {
      let _this = this
      let windowScrollTop = window.scrollY
      let innerHeight = window.innerHeight
      let scrollHeight = document.body.scrollHeight
      if (windowScrollTop + innerHeight + 10 >= scrollHeight && !this.isloading) {
        if (this.nomore) {
          return
        }
        _this.page ++
        _this.listRequest(this.bat_id)
        _this.loading = true
      }
    },
    // 调用原生 禁止下拉刷新功能
    pageRefresh () {
      bridge.pageRefresh({
        close: '1'
      }, function (cb) {
        console.log(cb.ret)
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
    border-top: 3px solid #EFEFEF;
    .Money {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FF8100;
      font-weight: 700;
      padding-bottom: 51px;
      span:first-of-type {
        font-size: 34px;
        margin-right: 4px;
        padding-top: 8px;
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
        border-bottom: 3px solid #EFEFEF;
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
        position: relative;
        background: #F7F7F7;
        margin-left: 0;
        padding-left: 30px;
        border: none;
        p {
          font-size: 30px;
          color: #606470;
        }
        p:nth-of-type(2) {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          line-height: 88px;
          text-align: center;
        }
        p:last-of-type {
          color: #606470;
        }
      }
    }
    .details_title {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 30px;
      height: 88px;
      border-bottom: 3px solid #EFEFEF;
      font-size: 32px;
      color: #FF8100;
      span {
        margin-right: 4px;
      }
      p:nth-of-type(2) {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 88px;
        text-align: center;
      }
    }
    .details {
      padding: 0 30px;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        height: 88px;
        border-bottom: 3px solid #EFEFEF;
        p {
          color: #606470;
          font-size: 30px;
        }
        p:first-of-type img {
          width: 48px;
          height: 48px;
          vertical-align: middle;
          margin-right: 16px;
        }
        p:nth-of-type(2) {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 88px;
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
