<template>
  <div class="container">
    <div class="balance_container">
      <p class="balance_text">余额  (元)</p>
      <div class="balance_box">
        <p class="balance">15680.00</p>
        <p class="returnOld_vision">返回旧版</p>
      </div>
      <div class="wechat_user">
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
      <li class="record_list">
        <!-- 单笔记录 -->
        <div class="one_record">
          <p class="date">
            <span class="day">2017/11/22</span>
            <span class="week">星期三</span>
          </p>
          <p class="money">￥898.00</p>
          <p class="status">
            <span>银行处理中</span>
            <span class="arrow"></span>
          </p>
        </div>
        <!-- 多笔记录 -->
        <div class="multiple_record_container">
          <div class="multiple_record">
            <p class="date">
              <span class="day">2017/11/22</span>
              <span class="week">星期三</span>
            </p>
            <p class="status">
              <span class="tips">此款项分<span>3</span>笔到账</span>
            </p>
          </div>
          <ul>
            <li class="multiple_record_list" @click="godetail()">
              <p>第<span>1</span>笔</p>
              <p>￥ 100.00</p>
              <p class="status">
                <span>已划款</span>
                <span class="arrow"></span>
              </p>
              <div class="fail_tips">
                <span class="triangle"></span>
                <span>划款失败的资金会暂存到余额，与明日资金一起划款</span>
              </div>
            </li>
            <li class="multiple_record_list">
              <p>第<span>1</span>笔</p>
              <p>￥ 100.00</p>
              <p class="status">
                <span>已划款</span>
                <span class="arrow"></span>
              </p>
              <div class="fail_tips">
                <span class="triangle"></span>
                <span>划款失败的资金会暂存到余额，与明日资金一起划款</span>
              </div>
            </li>
            <li class="multiple_record_list">
              <p>第<span>1</span>笔</p>
              <p>￥ 100.00</p>
              <p class="status">
                <span>已划款</span>
                <span class="arrow"></span>
              </p>
              <div class="fail_tips">
                <span class="triangle"></span>
                <span>划款失败的资金会暂存到余额，与明日资金一起划款</span>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {

      }
    },
    created () {
      this.requestlist()
    },
    methods: {
      godetail () {
        this.$router.push({name: 'detail'})
      },
      requestlist () {
        this.$http({
          url: 'http://172.100.116.238:7200/account/remit/record/',
          method: 'GET',
          params: {
            page: 1,
            month: '2017-11',
            format: 'cors'
          }
        }).then(response => {
          let data = response.data
          console.log(data)
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
   .fail_tips {
     // display: none;
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
 }
</style>
