<template>
  <div>
    <div v-if="wx_oauth_mchnt" class="header" @click="viewWechatDetail()">
      <p>您是微信特约商户，查看更多到账说明</p>
    </div>
    <div class="tab">
      <p>划款时间</p>
      <p>划款金额</p>
      <p>划款状态</p>
    </div>
    <ul class="record_list_container">
      <li class="record_list" v-for="(items, index) in recordList">
        <!-- 单笔记录 -->
        <div class="one_record" v-for="item in items" v-if="items.length === 1" @click="godetail(item.biz_sn, item.state)">
          <p class="date">
            <span class="day">{{item.ctime | splitDate}}</span>
            <span class="week">星期{{item.ctime | format | formatWeekDay}}</span>
          </p>
          <p class="money"><sub>￥</sub><span>{{item.amt | formatCurrencyStr | formatCurrencyThree}}</span></p>
          <p class="status">
            <span :class="{'processes' : item.state === 1 , 'success' : item.state === 2 || item.state === 4, 'fail' : item.state === 3}">{{statusText(item.state)}}</span>
            <span class="arrow"></span>
          </p>
          <div class="fail_tips" v-if="item.state === 3">
            <span class="triangle"></span>
            <span>划款失败的款项会退回到您的余额中，银行会为您重新划款。</span>
          </div>
        </div>
        <!-- 多笔记录 -->
        <div class="multiple_record_container" v-if="items.length > 1">
          <div class="multiple_record">
            <p class="date">
              <span class="day">{{items[0].ctime | splitDate}}</span>
              <span class="week">星期{{items[0].ctime | format | formatWeekDay}}</span>
            </p>
            <p class="total"><sub>￥</sub><span>{{currentDayAmtTotal(items) | formatCurrencyStr | formatCurrencyThree}}</span></p>
            <p class="status">
              <span class="tips">分<span>{{items.length}}</span>笔到账</span>
            </p>
          </div>
          <ul>
            <li class="multiple_record_list" @click="godetail(item.biz_sn, item.state)" v-for="(item, index) in items">
              <p>第<span>{{index + 1}}</span>笔</p>
              <p class="money"><sub>￥</sub><span>{{item.amt | formatCurrencyStr | formatCurrencyThree}}</span></p>
              <p class="status">
                <span :class="{'processes' : item.state === 1 , 'success' : item.state === 2 || item.state === 4, 'fail' : item.state === 3}">{{statusText(item.state)}}</span>
                <span class="arrow"></span>
              </p>
              <div class="fail_tips" v-if="item.state === 3">
                <span class="triangle"></span>
                <span>划款失败的款项会退回到您的余额中，银行会为您重新划款。</span>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <infinite-loading @infinite="requestlist" ref="infiniteLoading" spinner="spiral">
      <span slot="no-more">您可登录商户网站查看更多历史数据</span>
      <span slot="no-results">暂无数据</span>
    </infinite-loading>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  import InfiniteLoading from 'vue-infinite-loading'
  import bridge from 'methods/bridge-v2'
  import config from 'methods/config.js'
  import util from 'methods/util'
  export default {
    components: {
      InfiniteLoading
    },
    data () {
      return {
        recordList: [],
        amt: '',
        wx_oauth_mchnt: 0,
        page: 1,
        resArr: [],
        monthArr: [],
        shopid: '',
        shopname: ''
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.recordList = []
        util.setTitle('账户余额')
      })
    },
    created () {
      this.shopid = this.$route.query.shopid
      this.shopname = this.$route.query.shopname
      window.localStorage.setItem('shopid', this.$route.query.shopid)
      this.calMonths()
    },
    filters: {
      splitDate (item) {
        let date = item.substring(0, 10)
        return date.replace(/-/g, '/')
      },
      format (item) {
        let date = item.substring(0, 10)
        let arr = []
        let sdate
        arr = date.split('-')
        sdate = new Date(arr[0], parseInt(arr[1] - 1), arr[2])
        return sdate.getDay()
      }
    },
    mounted () {
      this.appBridge()
    },
    methods: {
      currentDayAmtTotal(items) {
        let total = 0
        Object.keys(items).map(function(key) {
          if (items[key].state !== 3) {
            total += items[key].amt
          }
        })
        return total
      },
      godetail (bizSn, state) {
        switch (state) {
          case 1:
            _hmt.push(['_trackEvent', 'arrival-record', 'bank-doing', 'click'])
            break
          case 2:
            _hmt.push(['_trackEvent', 'arrival-record', 'trade-done', 'click'])
            break
          case 3:
            _hmt.push(['_trackEvent', 'arrival-record', 'trade-fail', 'click'])
            break
        }
        this.$router.push({name: 'outerDetail', params: {biz_sn: bizSn}})
      },
      viewWechatDetail () {
        _hmt.push(['_trackEvent', 'arrival-record', 'wechat-merchant', 'click'])
        this.$router.push({name: 'fqa'})
      },
      statusText (state) {
        switch (state) {
          case 1:
            return '银行处理中'
          case 2:
            return '已划款'
          case 3:
            return '划款失败'
          case 4:
            return '微信划款'
        }
      },
      appBridge () {
        let urlStr = `${window.location.origin}${window.location.pathname}#/account?shopid=${this.shopid}`
        bridge.setNavMenu({
          buttons: [
            {
              type: 'uri',
              uri: urlStr,
              title: '明细'
            },
            {
              type: 'uri',
              uri: `${window.location.origin}${window.location.pathname}#/fqa`,
              icon: 'https://o95yi3b1h.qnssl.com/40F12F92A55747B8AD759E05968A331D/0/upload/87a694add159467da368e8a9cabf03a5.jpg'
            }
          ]
        })
        bridge.pageRefresh({
          close: '1'
        })
      },
      calMonths () {
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth() + 1
        this.calOneMonth(year, month)
        if (month === 1) {
          year -= 1
          month = 12
        } else {
          month -= 1
        }
        this.calOneMonth(year, month)
        month = today.getMonth() + 1
        if (month === 1) {
          year -= 1
          month = 11
        } else if (month === 2) {
          year -= 1
          month = 12
        } else {
          month -= 2
        }
        this.calOneMonth(year, month)
      },
      calOneMonth (year, month) {
        let monthStr = year + '-' + (month <= 9 ? `0${month}` : month)
        this.monthArr.push(monthStr)
      },
      requestlist($state) {
        this.$http({
          url: `${config.oHost}fund/v1/account/remit/record/`,
          method: 'GET',
          params: {
            page: this.page,
            month: this.monthArr[0],
            shopid: this.shopid || '',
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          let resData = res.data.data
          if (res.respcd === '0000') {
            this.amt = res.data.amt
            this.wx_oauth_mchnt = res.data.wx_oauth_mchnt
            window.localStorage.setItem('wx_oauth_mchnt', res.data.wx_oauth_mchnt)
            this.resArr = this.resArr.concat(resData)
            if (resData.length < 20 && this.monthArr.length > 1) {
              this.monthArr.shift()
              this.page = 1
              let maxNum = (this.monthArr.length - 2) * 20 + 21
              if (this.resArr.length > maxNum) {
                this.renderData()
                $state.reset()
              } else {
                $state.loaded()
              }
            } else if (resData.length === 20) {
              this.page++
              $state.loaded()
            } else {
              this.renderData()
              $state.complete()
            }
          } else {
            $state.complete()
            this.$toast(res.resperr)
          }
        })
      },
      renderData() {
        this.recordList.length = 0
        this.resArr.map((item, index) => {
          let dataArr = []
          dataArr.push(item)
          this.recordList.push(dataArr)
        })
        for (let i = 0; i < this.recordList.length - 1; i++) {
          if (this.recordList[i][this.recordList[i].length - 1].ctime.substring(0, 10) === this.recordList[i + 1][0].ctime.substring(0, 10)) {
            this.recordList[i] = this.recordList[i].concat(this.recordList[i + 1])
            this.recordList.splice((i + 1), 1)
            i--
          }
        }
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
 @import "../../../styles/global.scss";
 body {
   background: #F7F7F7;
 }
 .header {
   background: #FFF4E7 url('../assets/wechat.png') no-repeat;
   background-size: auto 120px;
   font-size: 26px;
   height: 120px;
   line-height: 120px;
   padding-left: 146px;
   padding-right: 30px;
   margin: 20px 20px 0;
   p {
     display: inline-block;
     width: 100%;
     line-height: 1.4;
     background: url('../assets/arrow.png') center right no-repeat;
     background-size: auto 30px;
   }
 }
 .tab {
   height: 64px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   color: #606470;
   font-size: 26px;
   padding: 0 30px;
   background-color: #F7F7F7;
   box-shadow: 0 -2px 6px rgba(0,0,0,.1);
 }
 .arrow {
   display: inline-block;
   width: 16px;
   height: 30px;
   background: url('../assets/arrow.png') no-repeat;
   background-size: 100% 100%;
   margin-left: 16px;
 }
 .status {
   font-size: 30px;
   display: flex;
   align-items: center;
   .processes {
     color: #FF8100;
   }
   .success {
     color: #71D321;
   }
   .fail {
     color: #FF3D1F;
   }
 }
 .record_list_container {
   background: #fff;
   .record_list {
     min-height: 132px;
     padding: 0 30px;
     border-bottom: 2px solid #EFEFEF;
     .one_record {
       position: relative;
       min-height: 132px;
       display: flex;
       align-items: center;
       flex-wrap: wrap;
       justify-content: space-between;
       .date {
         color: #606470;
         padding: 30px 0;
         .day {
           display: block;
           font-size: 26px;
         }
         .week {
           display: block;
           font-size: 30px;
           margin-top: 10px;
         }
       }
       .money {
         font-size: 36px;
         sub, span {
           vertical-align: baseline;
         }
       }
       .status {
         color: #FF8100;
         font-size: 30px;
         display: flex;
         align-items: center;
       }
       .fail_tips {
         margin-bottom: 30px;
         margin-top: 0;
       }
     }
   }
   .multiple_record {
     position: relative;
     height: 136px;
     display: flex;
     align-items: center;
     justify-content: space-between;
     border-bottom: 3px dashed #EFEFEF;
     .date {
       color: #606470;
       // height: 100%;
       padding: 30px 0;
       .day {
         display: block;
         font-size: 26px;
       }
       .week {
         display: block;
         font-size: 30px;
         margin-top: 10px;
       }
     }
     .total {
       sub, span {
         vertical-align: baseline;
       }
       font-size: 36px;
       color: #000;
     }
   }
 }
 .multiple_record_list {
   position: relative;
   min-height: 82px;
   display: flex;
   flex-wrap: wrap;
   justify-content: space-between;
   padding: 30px 0;
   &:last-of-type {
     border-bottom: none;
   }
   p:first-of-type {
     font-size: 30px;
     color: #606470;
   }
   p:nth-of-type(2) {
     width: 100%;
     height: 100%;
     position: absolute;
     left: 0;
     top: 0;
     line-height: 102px;
     text-align: center;
   }
   .money {
     sub, span {
       vertical-align: baseline;
     }
     font-size: 30px;
     color: #606470;
     sub {
       font-size: 24px;
     }
   }
   .status p:first-of-type {
     color: #71D321;
   }
 }
 .fail_tips {
   position: relative;
   background: #FFF4E7;
   color: #FF3D1F;
   height: 80px;
   border-radius: 6px;
   line-height: 80px;
   text-align: center;
   width: 100%;
   margin-top: 20px;
   .triangle {
     position: absolute;
     width: 0;
     height: 0;
     border-left: 12px solid transparent;
     border-right: 12px solid transparent;
     border-bottom: 12px solid #FFF4E7;
     top: -12px;
     left: 50%;
   }
   span:last-of-type {
     display: inline-block;
     width: 100%;
     white-space:nowrap;
     overflow:hidden;
     text-overflow:ellipsis;
   }
 }
 .no_data {
   margin-top: 140px;
   text-align: center;
   img {
     width: 340px;
   }
   p {
     font-size: 30px;
     margin-top: 50px;
     color: #8A8C92;
   }
 }
</style>
