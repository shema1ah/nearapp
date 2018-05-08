<template>
<div>
  <header class="wechat-mchnt" v-if="wx_oauth_mchnt">
    <span @click="menuClick(0)" :class="{'active': !isOther}">微信特约商户</span><span :class="{'active': isOther}" @click="menuClick(1)">其他问题</span>
  </header>
  <ul v-show="!isOther" class="qfa-list">
    <li>
      <h3>为什么会出现到账金额比实际交易金额少或者无划款记录的情况?</h3>
      <p>开通了微信实名后，款项由微信操作到。请登录微信的商户后台查看
        （<a href="https://pay.weixin.qq.com/">https://pay.weixin.qq.com/</a>）
        </p>
    </li>
    <li>
      <h3>已经开通了微信实名的商户如何查询自己的到账情况?</h3>
      <p>成功开通时间起，款项都是由微信操作到账，建议联系微信小助手（<a href="http://www.wxxzs.com/">www.wxxzs.com</a>）进行查询处理。</p>
    </li>
    <li>
      <h3>微信实名的账号是多少？怎么登录? </h3>
      <p>提交微信实名时，是有预留个人的邮箱，实名开通后微信会将登录平台，登录账号以及密码通过邮件形式发送到邮箱内，可自行登录平台查看。</p>
    </li>
    <li>
      <h3>如何自动提现？ </h3>
      <p>
        提现教程请点击：<br/>
        <a href="http://kf.qq.com/faq/140225MveaUz160908aYf6jM.html">http://kf.qq.com/faq/140225MveaUz160908aYf6jM.html</a>
      </p>
    </li>
    <li>
      <h3>消费者退款如何处理？</h3>
      <p>此类特殊请款需尽快联系微信反馈申请。</p>
    </li>
    <li>
      <h3>怎么更改账号信息？</h3>
      <p>登录微信平台后点击账号中心—商户信息进行更改。</p>
    </li>
    <li>
      <h3>我怎么查看的个人信息，比如手机号？</h3>
      <p>登录后在账号中心的个人信息处可以查看并更改。</p>
    </li>
    <li>
      <h3>这个平台有什么好的功能可以推荐？</h3>
      <p>登录后营销中心处，可以自行设置代金券随机减等活动，同时配备模板。</p>
    </li>
    <li>
      <h3>怎么看以前的交易到账记录？</h3>
      <p>交易中心处可以查看您的交易记录及到账等信息，可以通过筛选日期，达到查看历史数据的需求。</p>
    </li>
  </ul>
  <ul v-show="isOther" class="qfa-list">
    <li>
      <h3>账户余额指什么？</h3>
      <p>账户余额是指商户交易后扣除掉手续费的实际收入但未划款到商户结算卡的金额总和，银行会按照您的结算周期为您划款到您的结算卡中，如划款失败，该笔款项会回到账户余额内。您可以通过右上角【明细】来查询核对你的账户余额。</p>
    </li>
    <li>
      <h3>划款状态中的“银行处理中”和“已划款”是什么意思？</h3>
      <p>“银行处理中”指该笔款项银行已准备为您划款，在处理流程中。
      “已划款”指银行已经处理完毕，资金经过流转后会到您的结算卡中，不同的结算卡到账时间存在差异，建议您使用网点比较广泛的大银行，到账时间更有保障。</p>
    </li>
    <li>
      <h3>交易什么时候可以到账？</h3>
      <p>如果您是T+1到账：
      当天交易，一般在次日下午18:00之前到账，周六日及法定节假日不清算，要在下一个工作日的第一天统一清算；<br/>
      如果您是D+1到账：
      当天交易，一般在次日下午18:00之前到账，节假日正常到账</p>
    </li>
    <li>
      <h3>交易没有按时到账怎么办？</h3>
      <p>请联系您的发卡行客服或者登录网银确认，如确认未到账，请提供网银截图或者打印盖有公章的银行流水账单到邮箱：help@qfpay.com，并注明您的入网电话，姓名，未到账的交易时间和金额，1-3个工作日内，会有专员帮您核实查询并回复邮件</p>
    </li>
    <li>
      <h3>为什么划款失败了？失败后怎么办？</h3>
      <p>银行账户信息有误导致划款失败，建议您核实银行卡信息，通过APP【我的】页面【我的银行卡】提交变更申请，变更完成后银行会在1-5个工作日内重新划款到新的银行卡，变更时间一般为1-3个工作日</p>
    </li>
    <li>
      <h3>为什么会分几笔到账？</h3>
      <p>由于银行系统繁忙，为了保证您的款项可以按时到账，系统会自动分笔划款，请放心您的款项，稍晚注意查收，如有问题请您咨询客服人员。</p>
    </li>
    <li>
      <h3>如何查看收取的手续费？</h3>
      <p>您可以通过【我的】页面【店铺签约信息】中查看您目前的签约费率，账户余额右上角【明细】中的【收款】查看交易所产生的手续费。当天实时交易的【收款】因为处于待入账状态，无法查看明细，建议您第二天再查看。</p>
    </li>
  </ul>
</div>
</template>
<script type="text/ecmascript-6">
import bridge from 'methods/bridge-v2'

export default {
  data () {
    return {
      isOther: true,
      wx_oauth_mchnt: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      document.title = '常见问题'
    })
  },
  created () {
    this.pageRefresh()
    let isWechat = window.localStorage.getItem('wx_oauth_mchnt') === '1'
    this.wx_oauth_mchnt = isWechat
    this.isOther = !isWechat
  },
  methods: {
    pageRefresh () {
      bridge.pageRefresh({
        close: '1'
      })
    },
    menuClick (key) {
      this.isOther = key
    }
  }
}
</script>
<style scoped lang="scss" type="scss" rel="stylesheet/scss">
.wechat-mchnt {
  background-color: #fff;
  margin-bottom: 24px;
  border-bottom: 2px solid #E5E5E5;
  span {
    height: 80px;
    line-height: 80px;
    text-align: center;
    display: inline-block;
    width: 50%;
    font-size: 30px;
    color: #606470;
    &.active {
      color: #FF8100;
      border-bottom: 4px solid #FF8100;
    }
  }
}
.qfa-list {
  margin: 0 0 50px 0;
  border-top: 2px solid #E5E5E5;
  border-bottom: 2px solid #E5E5E5;
  padding-left: 20px;
  padding-bottom: 36px;
  list-style: none;
  background-color: #fff;
  li {
    padding: 30px 30px 8px 40px;
  }
  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 30px;
    position: relative;
    &:after {
      content: " ";
      width: 15px;
      height: 15px;
      position: absolute;
      left: -30px;
      top: 12px;
      border-radius: 100%;
      background-color: #ff8100;
    }
  }
  p {
    font-size: 26px;
    line-height: 1.8;
    margin: 0;
    color: #8A8C92;
    a {
      color: #8A8C92;
    }
  }
}
</style>
