<template lang="html">
  <div class="wrapper">
    <header class="info">
      <h2>累计刺激消费 (元)</h2>
      <strong>{{info.total_amount | formatCurrency}}</strong>
      <div>
        <span>核销总数(个)<em>{{info.total_num}}</em>
        </span><span>优惠金额(元)<em>{{info.coupon_amount | formatCurrency}}</em>
        </span><span @click="tip()">推广费用(元)<img src="../assets/warn.svg"><em>{{info.commission_amount | formatCurrency}}</em></span>
      </div>
    </header>
    <div @click="viewDetail(item.actid)" v-for="item in actvList" class="item" :class="{'active': item.status, 'cancel': !item.status}">
      <header>
        <h3>{{item.actname}}</h3><span>{{item.status ? '进行中' : '已结束'}}</span>
      </header>
      <ul>
        <li><em>刺激消费</em><span>{{item.trade_amount | formatCurrency}}元</span></li>
        <li><em>核销数</em><span>{{item.trade_num}}个</span></li>
        <li><em>优惠金额</em><span>{{item.coupon_amount | formatCurrency}}元</span></li>
        <li><em>推广费用</em><span>{{item.commi_amount | formatCurrency}}元</span></li>
      </ul>
      <button><span>查看详情</span><img src="../assets/arrow-right.svg"></button>
    </div>
    <infinite-loading :on-infinite="getData" spinner="spiral">
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </infinite-loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import InfiniteLoading from 'vue-infinite-loading'
  import config from 'methods/config'
  import utils from 'methods/util'
  export default {
    components: {
      InfiniteLoading
    },
    data () {
      return {
        info: {},
        isLoading: false,
        actvList: [],
        page: 0
      }
    },
    created () {
      utils.setTitle('店铺推广')
      // this.getData()
    },
    methods: {
      tip() {
        this.$messagebox({
          title: '推广费用=(刺激消费/优惠金额 ) * 抽佣比例',
          confirmButtonText: '我知道了'
        })
      },
      getData($state) {
        this.isLoading = true
        this.$http({
          url: `${config.oHost}mchnt/commission/summary`,
          method: 'GET',
          params: {
            format: 'cors',
            pagesize: 10,
            page: this.page
          }
        }).then(response => {
          this.isLoading = false
          let res = response.data
          let data = response.data.data
          if (res.respcd === '0000') {
            if (!data.is_activity) {
              this.$router.push({
                name: 'index'
              })
              return
            }
            this.info.commission_amount = data.commission_amount
            this.info.coupon_amount = data.coupon_amount
            this.info.is_activity = data.is_activity
            this.info.total_amount = data.total_amount
            this.info.total_num = data.total_num
            this.actvList = this.actvList.concat(data.activitys)
            $state.loaded()
            this.page ++
            if (data.activitys.length < 10) {
              $state.complete()
            }
          } else {
            this.$toast(res.respmsg)
            $state.complete()
          }
        })
      },
      viewDetail (actvId) {
        this.$router.push({
          name: 'detail',
          params: {
            actvId
          }
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped rel="stylesheet/scss">
@import "../../../styles/base/var.scss";
.info {
  margin-bottom: 16px;
  background: #F34040 url('../assets/bg.png') no-repeat;
  background-size: 100% auto;
  color: #fff;
  text-align: center;
  padding-top: 50px;
  h2 {
    font-size: 26px;
    font-weight: normal;
  }
  strong {
    font-size: 46px;
  }
  div {
    margin-top: 18px;
    padding: 15px 0;
    font-size: 26px;
    background-color: rgba(255, 255, 255, 0.1);
    img {
      vertical-align: text-bottom;
      margin-left: 8px;
    }
  }
  span {
    display: inline-block;
    width: 33%;
    box-sizing: border-box;
    border-right: 2px solid rgba(255, 255, 255, 0.5);
    &:last-child {
      padding-right: 0;
      margin-right: 0;
      border-right: none;
    }
  }
  em {
    display: block;
  }
}
.item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 16px 16px;
  font-size: 30px;
  cursor: pointer;
  header {
    background-color: #FFF1D9;
    border-radius: 8px 8px 0 0;
    padding: 24px 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      font-size: 30px;
      font-weight: normal;
    }
    span {
      font-size: 20px;
      font-weight: 300;
      background-color: #FF8100;
      color: #fff;
      padding: 4px 16px;
      border-radius: 20px;
    }
  }
  &.active {
    h3 {
      color: #ff8100;
    }
  }
  &.cancel {
    h3 {
      color: #606470;
    }
    header {
      background-color: #E5E5E5;
      span {
        background-color: #A7A9AE;
      }
    }
  }
  ul {
    padding: 0 26px;
    li {
      border-bottom: 2px dashed #F0F0F0;
      line-height: 84px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    em {
      color: #606470;
      font-weight: 300;
    }
    span {
      color: #000;
    }
  }
  button {
    width: 100%;
    font-weight: 300;
    cursor: pointer;
    color: #606470;
    height: 84px;
    line-height: 84px;
    span, img {
      vertical-align: middle;
    }
    img {
      margin-left: 16px;
    }
  }
}
</style>
