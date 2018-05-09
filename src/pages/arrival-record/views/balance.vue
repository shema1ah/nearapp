<template>
  <div>
    <div class="loading_box" v-if="hasdata">
      <div class="balance_container">
        <div class="balance_box">
          <p class="balance_text">余额  (元)</p>
          <p class="balance">{{amt | formatCurrencyStr | formatCurrencyThree}}</p>
        </div>
        <img v-if="wx_oauth_mchnt" class="wechat-icon" @click="viewWechatDetail()" src="../assets/wechat-icon.png" alt="微信特约商户">
      </div>
      <div class="tab">
        <p>划款时间</p>
        <p>划款金额</p>
        <p>划款状态</p>
      </div>
      <ul class="record_list_container">
        <li class="record_list" v-for="(items, index) in recordList" v-if="(index != recordList.length - 1) || nomore">
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
      <div class="no_data" v-if="!recordList.length && !firstload">
        <img src="../../../assets/no-data.png" alt="暂无数据">
        <p>暂无数据</p>
      </div>
    </div>
    <loading :visible='isloading'></loading>
    <div class="no_more" v-if="nomore && recordList.length">
      您可登录商户网站查看更多历史数据
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  import loading from 'components/loading/juhua.vue'
  import bridge from 'methods/bridge-v2'
  import config from 'methods/config.js'
  import util from 'methods/util'
  export default {
    data () {
      return {
        recordList: [],
        amt: '',
        wx_oauth_mchnt: 0,
        page: 1,
        resArr: [],
        nomore: 0,
        isloading: false,
        hasdata: false,
        monthArr: [],
        shopid: '',
        shopname: '',
        Loadmore: null,
        firstload: true
      }
    },
    components: {
      loading
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
      this.setNavMenu()
      this.getMonth()
      this.requestlist()
    },
    computed: {
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
      let _this = this
      this.Loadmore = function () {
        let windowScrollTop = window.scrollY
        let innerHeight = window.innerHeight
        let scrollHeight = document.body.scrollHeight
        if (windowScrollTop + innerHeight + 10 >= scrollHeight && !_this.isloading) {
          if (_this.nomore) {
            return
          }
          _this.page ++
          _this.requestlist()
        }
      }
      window.addEventListener('scroll', this.Loadmore, false)
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
      appBridge () {
        bridge.pageRefresh({
          close: '1'
        })
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
      setNavMenu () {
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
      },
      getMonth () {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        for (let i = 0; i < 3; i++) {
          if (month === 0) {
            month = 12
            year--
          }
          month = (month < 10 ? '0' + month : month)
          let requestMonth = year + '-' + month
          this.monthArr.push(requestMonth)
          month--
        }
      },
      requestlist () {
        this.isloading = true
        this.firstload = false
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
          this.isloading = false
          let res = response.data
          if (res.respcd === '0000') {
            this.hasdata = true
            this.nomore = res.data.data.length || this.monthArr.length !== 1 ? 0 : 1
            this.amt = res.data.amt
            this.wx_oauth_mchnt = res.data.wx_oauth_mchnt
            window.localStorage.setItem('wx_oauth_mchnt', res.data.wx_oauth_mchnt)
            if (!res.data.data.length && this.monthArr.length > 1) {
              this.monthArr.shift()
              this.page = 1
              this.requestlist()
            } else if (this.nomore) {
              return
            }
            this.resArr = this.resArr.concat(res.data.data)
            if (this.resArr.length < 20 && this.monthArr.length > 1) {
              this.monthArr.shift()
              this.page = 1
              this.requestlist()
            } else if (this.monthArr.length === 1 && res.data.data.length < 20) {
              this.page++
              this.requestlist()
            }
            this.recordList.length = 0
            this.resArr.map((item, index) => {
              let dataArr = []
              dataArr.push(item)
              this.recordList.push(dataArr)
            })
            // 数据解析
            for (let i = 0; i < this.recordList.length - 1; i++) {
              if (this.recordList[i][this.recordList[i].length - 1].ctime.substring(0, 10) === this.recordList[i + 1][0].ctime.substring(0, 10)) {
                this.recordList[i] = this.recordList[i].concat(this.recordList[i + 1])
                this.recordList.splice((i + 1), 1)
                i--
              }
            }
          } else {
            this.$toast(res.resperr)
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
 .balance_container {
   height: 240px;
   background: #2D304D;
   color: #fff;
   padding-left: 30px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   .balance {
     font-size: 68px;
     font-weight: 700;
   }
   .balance_text {
     margin-bottom: 10px;
     font-size: 26px;
   }
   .wechat-icon {
     width: 124px;
     margin-top: 20px;
   }
 }
 .tab {
   height: 64px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   color: #606470;
   font-size: 26px;
   border-bottom: 2px solid #EFEFEF;
   padding: 0 30px;
   background: #F7F7F7;
 }
 .arrow {
   display: inline-block;
   width: 16px;
   height: 32px;
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
