<template>
<div>
  <header class="wechat-mchnt">
    <h3><img src="../assets/ic_weixin.svg" alt="微信图标">您是微信特约商户</h3>
    <p>请仔细阅读以下常见问题</p>
  </header>
  <ul class="qfa-list">
    <li>
      <h3>为什么会出现到账金额与实际交易金额少或者无划款记录的情况?</h3>
      <p>开通了微信实名后，款项由微信操作到。请登陆微信的商户后台查看
        （<a href="https://pay.weixin.qq.com/">https://pay.weixin.qq.com/</a>）
        </p>
    </li>
    <li>
      <h3>已经开通了微信实名的商户如何查询自己的到账情况?</h3>
      <p>成功开通时间起，款项都是由微信操作到账，建议联系微信小助手（<a href="http://www.wxxzs.com/">www.wxxzs.com</a>）进行查询处理。</p>
    </li>
    <li>
      <h3>微信实名的账号是多少？怎么登陆? </h3>
      <p>提交微信实名时，是有预留个人的邮箱，实名开通后微信会将登陆平台，登陆账号以及密码通过邮件形式发送到邮箱内，可自行登录平台查看。</p>
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
      <p>登陆微信平台后点击账号中心—商户信息进行更改。</p>
    </li>
    <li>
      <h3>我怎么查看的个人信息，比如手机号？</h3>
      <p>登陆后在账号中心的个人信息处可以查看并更改。</p>
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
</div>
</template>
<script type="text/ecmascript-6">
import bridge from 'methods/bridge-v2'

export default {
  data () {
    return {

    }
  },
  created () {
    this.pageRefresh()
  },
  methods: {
    // 调用原生的ios禁止下拉刷新功能
    pageRefresh () {
      bridge.pageRefresh({
        close: '1'
      })
    }
  }
}
</script>
<style scoped lang="scss" type="scss" rel="stylesheet/scss">
.wechat-mchnt {
  padding: 20px 60px 20px 30px;
  h3 {
    font-size: 34px;
    margin-bottom: 6px;
    img {
      width: 48px;
      height: 48px;
      vertical-align: text-bottom;
      margin-right: 12px;
    }
  }
  p {
    color: #8A8C92;
    font-size: 26px;
    em {
      color: #2F323A;
      font-style: normal;
    }
  }
}
.qfa-list {
  margin: 0;
  padding-left: 30px;
  padding-bottom: 36px;
  list-style: none;
  background-color: #fff;
  border-top: 3px solid #E5E5E5;
  li {
    border-bottom: 3px solid #E5E5E5;
    padding: 30px 30px 30px 40px;
  }
  h3 {
    margin-bottom: 20px;
    font-size: 30px;
    position: relative;
    &:after {
      content: " ";
      width: 0.26rem;
      height: 0.26rem;
      position: absolute;
      left: -38px;
      top: 8px;
      border-radius: 100%;
      background-color: #FE9B20;
    }
  }
  p {
    color: #8A8C92;
    a {
      color: #8A8C92;
    }
  }
}
</style>
