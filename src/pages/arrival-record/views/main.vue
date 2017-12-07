<template>
  <div class="container" v-if="hasdata">
    <div class="balance_container">
      <p class="balance_text">余额  (元)</p>
      <div class="balance_box">
        <p class="balance">{{amt}}</p>
        <p class="returnOld_vision">返回旧版</p>
      </div>
      <div class="wechat_user" v-if="wx_oauth_mchnt">
        <div class="wechat_user_left">
          <p>
            <span class="wechat_logo"></span>
            <span>您是微信特约商户</span>
          </p>
          <p>您可通过微信商户后台查看到账情况，查看详情</p>
        </div>
        <div class="arrow"></div>
      </div>
    </div>
    <div class="tab">
      <p>划款时间</p>
      <p>划款金额</p>
      <p>划款状态</p>
    </div>
    <ul class="record_list_container">
      <li class="record_list" v-for="(items, index) in recordList">
        <!-- 单笔记录 -->
        <div class="one_record" v-for="item in items" v-if="items.length === 1" @click="godetail(item.biz_sn)">
          <p class="date">
            <span class="day">{{item.ctime | splitDate}}</span>
            <span class="week">星期{{item.ctime | format | formatWeekDay}}</span>
          </p>
          <p class="money">￥{{item.amt}}</p>
          <p class="status">
            <span :class="{'processes' : item.state === 1 , 'success' : item.state === 2, 'fail' : item.state === 3}">{{statusText(item.state)}}</span>
            <span class="arrow"></span>
          </p>
          <div class="fail_tips" v-if="item.state === 3">
            <span class="triangle"></span>
            <span>划款失败的资金会暂存到余额，与明日资金一起划款</span>
          </div>
        </div>
        <!-- 多笔记录 -->
        <div class="multiple_record_container" v-if="items.length > 1">
          <div class="multiple_record">
            <p class="date">
              <span class="day">{{items[0].ctime | splitDate}}</span>
              <span class="week">星期{{items[0].ctime | format | formatWeekDay}}</span>
            </p>
            <p class="status">
              <span class="tips">此款项分<span>{{items.length}}</span>笔到账</span>
            </p>
          </div>
          <ul>
            <li class="multiple_record_list" @click="godetail(item.biz_sn)" v-for="(item, index) in items">
              <p>第<span>{{index + 1}}</span>笔</p>
              <p>￥ {{item.amt}}</p>
              <p class="status">
                <span :class="{'processes' : item.state === 1 , 'success' : item.state === 2, 'fail' : item.state === 3}">{{statusText(item.state)}}</span>
                <span class="arrow"></span>
              </p>
              <div class="fail_tips" v-if="item.state === 3">
                <span class="triangle"></span>
                <span>划款失败的资金会暂存到余额，与明日资金一起划款</span>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <loading :visible='loading'></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import loading from '../../../components/loading/juhua.vue'
  export default {
    data () {
      return {
        recordList: [],
        amt: '',
        wx_oauth_mchnt: '',
        page: 1,
        resArr: [],
        nomore: 0,
        loading: false,
        hasdata: false,
        mock: [
          {
            'amt': -1000,
            'state': 3,
            'ctime': '2017-12-05 11:02:29',
            'action_type': 3,
            'biz_sn': '20171127016100020000012534'
          },
          {
            'amt': -1000,
            'state': 3,
            'ctime': '2017-12-06 11:03:29',
            'action_type': 3,
            'biz_sn': '20171127016100020000012534'
          },
          {
            'amt': -1000,
            'state': 2,
            'ctime': '2017-12-06 11:02:29',
            'action_type': 2,
            'biz_sn': '20171127016100020000012534'
          },
          {
            'amt': -1000,
            'state': 2,
            'ctime': '2017-12-08 11:02:29',
            'action_type': 3,
            'biz_sn': '20171127016100020000012534'
          },
          {
            'amt': -1000,
            'state': 2,
            'ctime': '2017-12-08 10:02:29',
            'action_type': 3,
            'biz_sn': '20171127016100020000012534'
          },
          {
            'amt': -1000,
            'state': 2,
            'ctime': '2017-12-09 11:02:29',
            'action_type': 3,
            'biz_sn': '20171127016100020000012534'
          },
          {
            'amt': -1000,
            'state': 2,
            'ctime': '2017-12-10 11:02:29',
            'action_type': 3,
            'biz_sn': '20171127016100020000012534'
          }
        ]
      }
    },
    components: {
      loading
    },
    created () {
      this.loading = true
      this.requestlist()
    },
    computed: {

    },
    filters: {
      splitDate (item) {
        return item.substring(0, 10)
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
      let _this = this
      window.onscroll = () => {
        if (this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight()) {
          if (this.nomore) {
            this.$toast('没有更多了。。。')
            return
          }
          _this.page ++
          _this.requestlist()
        }
      }
    },
    methods: {
      godetail (bizSn) {
        this.$router.push({name: 'detail', params: {biz_sn: bizSn}})
      },
      statusText (state) {
        switch (state) {
          case 1:
            return '银行处理中'
          case 2:
            return '已划款'
          case 3:
            return '划款失败'
        }
      },
      requestlist () {
        this.$http({
          url: 'http://172.100.107.244:7200/account/remit/record/',
          method: 'GET',
          params: {
            page: this.page,
            month: '2017-12',
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            this.loading = false
            this.hasdata = true
            this.nomore = res.data.data.length ? 0 : 1
            // let _this = this
            this.amt = res.data.amt
            this.wx_oauth_mchnt = res.data.wx_oauth_mchnt
            if (this.nomore) {
              return
            }
            this.resArr = this.resArr.concat(res.data.data)
            this.recordList.length = 0
            this.resArr.map((item, index) => {
              let dataArr = []
              dataArr.push(item)
              this.recordList.push(dataArr)
            })
            // this.recordList.map((item, index) => {
            //   if (index === this.recordList.length - 1) {
            //     return
            //   }
            //   console.log(index)
            //   if (_this.recordList[index][_this.recordList[index].length - 1].ctime.substring(0, 10) === _this.recordList[index + 1][0].ctime.substring(0, 10)) {
            //     _this.recordList[index] = _this.recordList[index].concat(_this.recordList[index + 1])
            //     _this.recordList.splice((index + 1), 1)
            //     index--
            //   }
            // })
            for (let i = 0; i <= this.resArr.length - 1; i++) {
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
   min-height: 214px;
   background: #2D304D;
   color: #fff;
   padding: 0 30px;
   display: flex;
   flex-direction: column;
   justify-content: space-around;
   .balance {
     font-size: 68px;
     font-weight: 700;
   }
   .balance_text {
     margin: 50px 0 16px 0;
     font-size: 26px;
   }
   .balance_box {
     display: flex;
     align-items: center;
     justify-content: space-between;
     margin-bottom: 50px;
     .returnOld_vision {
       width: 198px;
       height: 70px;
       border-radius: 6px;
       text-align: center;
       line-height: 70px;
       font-size: 26px;
       border: 2px solid #fff;
       border-radius: 6px;
     }
   }
   .wechat_user {
     height: 154px;
     background: #fff;
     border: 1px solid #E5E5E5;
     color: #000;
     border-radius: 6px 6px 0 0;
     display: flex;
     align-items: center;
     justify-content: space-around;
     .wechat_user_left p:first-of-type .wechat_logo {
       display: inline-block;
       width: 48px;
       height: 48px;
       background: url(../assets/wechat_ic.png);
       vertical-align: middle;
     }
     .wechat_user_left p:first-of-type span:last-of-type {
       font-size: 30px;
       vertical-align: middle;
     }
     .wechat_user_left p:last-of-type {
       font-size: 26px;
       color: #606470;
       margin-top: 20px;
     }
   }
 }
 .tab {
   height: 64px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   color: #606470;
   font-size: 26px;
   border-bottom: 1px solid #E5E5E5;
   padding: 0 30px;
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
     border-bottom: 1px solid #E5E5E5;
     .one_record {
       display: flex;
       align-items: center;
       flex-wrap: wrap;
       justify-content: space-between;
       .date {
         color: #606470;
         display: flex;
         flex-direction: column;
         justify-content: space-between;
         .day {
           font-size: 26px;
           margin-top: 30px;
         }
         .week {
           font-size: 30px;
           margin: 20px 0 30px 0;
         }
       }
       .money {
         font-size: 36px;
         color: #000;
       }
       .status {
         color: #FF8100;
         font-size: 30px;
         display: flex;
         align-items: center;
       }
     }
   }
   .multiple_record {
     display: flex;
     align-items: center;
     justify-content: space-between;
     border-bottom: 1px dashed #E5E5E5;
     .date {
       color: #606470;
       display: flex;
       flex-direction: column;
       justify-content: space-between;
       .day {
         font-size: 26px;
         margin-top: 30px;
       }
       .week {
         font-size: 30px;
         margin: 20px 0 30px 0;
       }
     }
     .money {
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
   border-bottom: 1px dashed #E5E5E5;
   padding: 30px 0;
   p:first-of-type {
     font-size: 30px;
     color: #606470;
   }
   p:nth-of-type(2) {
     font-size: 36px;
   }
   .status p:first-of-type {
     color: #71D321;
   }
 }
 .fail_tips {
   position: relative;
   background: #FFF4E7;
   color: #FF3D1F;
   margin-bottom: 30px;
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
 }
</style>
