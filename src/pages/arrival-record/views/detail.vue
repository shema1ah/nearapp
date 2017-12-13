<template lang="html">
  <div class="container">
    <div class="loading_box" v-if="hasdata">
      <div class="top_container">
        <div class="bank">
          <img :src="data.bank_icons" class="bank_icon"/>
          <p class="bank_name">{{data.bank_name}}</p>
        </div>
        <div class="money">
          <span>￥</span>
          <span>{{data.amt | formatCurrency}}</span>
        </div>
      </div>
      <div class="bank_status">
        <p class="processes">
          <span class="processes_ing"></span>
          <span>银行处理中</span>
        </p>
        <div>
          <p class="line1"></p>
          <p :class="{'line2' : data.state === 2 || data.state === 3, 'processes_line' : data.state === 1}"></p>
        </div>
        <p class="processes">
          <span :class="{'success' : data.state === 2, 'progress' : data.state === 1, 'fail' : data.state === 3}" class="processes_result"></span>
          <span>已划款</span>
        </p>
        <div class="tips_text">
          <p>
            <span>*</span>
            <span>{{result_text}}</span>
          </p>
        </div>
      </div>
      <ul class="detail_list">
        <li>
          <p>转入账户</p>
          <p>{{data.bank_name}}({{data.cardno | splitBankCode}})</p>
        </li>
        <li>
          <p>结算方式</p>
          <p>自动划款</p>
        </li>
        <li>
          <p>划款时间</p>
          <p>{{data.ctime | formatDate}}</p>
        </li>
      </ul>
    </div>
    <loading :visible='loading'></loading>
  </div>
</template>

<script>
import loading from '../../../components/loading/juhua.vue'
import util from '../../../methods/util'
import config from '../../../methods/config'
import bridge from '../../../methods/bridge-v2'
export default {
  data () {
    return {
      data: {},
      loading: false,
      hasdata: false
    }
  },
  components: {
    loading
  },
  created () {
    this.loading = true
    this.request(this.$route.params.biz_sn)
  },
  computed: {
    result_text () {
      let state = this.data.state
      switch (state) {
        case 1 :
          return '银行处理中的文案'
        case 2 :
          return '正常情况下18:00之前到账，如未到账，请咨询您的发卡行'
        case 3 :
          return '银行划款失败，此笔款项会退回到您的余额中。请确认您的银行卡状态无误，银行会为您再次出款。如有疑问，请及时联系客服。'
      }
    }
  },
  filters: {
    splitBankCode (item) {
      return item.substr(item.length - 4)
    },
    formatDate (item) {
      return item.replace(/-/g, '/')
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      util.setTitle('划款详情')
    })
  },
  mounted () {
    this.pageRefresh()
  },
  methods: {
    request (bizSn) {
      this.$http({
        url: `${config.oHost}fund/v1/remit/details/`,
        method: 'GET',
        params: {
          biz_sn: bizSn,
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          this.hasdata = true
          let data = res.data
          this.loading = false
          this.data = data
        } else {
          this.loading = false
          this.$toast(res.resperr)
        }
      })
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
          display: block;
          width: 44px;
          height: 44px;
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
      min-height: 310px;
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
        .success {
          background: url('../assets/status_ic2.png');
        }
        .fail {
          background: url('../assets/status_ic4.png');
        }
        .progress {
          background: url('../assets/status_ic3.png');
        }
        .processes_result {
          width: 42px;
          height: 42px;
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
      >div .processes_line {
        width: 2px;
        height: 40px;
        background: #A7A9AE;
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
