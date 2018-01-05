<template lang="html">
  <div class="wrapper">
    <img src="../assets/logo.png" alt="零售通logo">
    <ul>
      <li>
        <i class="duo"></i>
        <p>进口货品、地方特色、独家商品<br>货源充足品类丰富</p>
      </li>
      <li>
        <i class="kuai"></i>
        <p>全国范围区域仓<br>保障货品次日抵达</p>
      </li>
      <li>
        <i class="hao"></i>
        <p>阿里平台源头好货<br>商品经小二审核，品质更有保障</p>
      </li>
      <li>
        <i class="sheng"></i>
        <p>进货价格更低、促销活动更多<br>真正让利商户</p>
      </li>
    </ul>
    <p class="info">快速进货服务由阿里巴巴旗下零售通提供。为了保证您有更好的进货体验和售后服务，将会获取您的部分商户信息授权给零售通使用，如店铺名称、店铺地址、经营信息等。</p>
    <p class="agreement">
      <input checked id="agreementCheckbox" @change="checkedBox($event)" type="checkbox"/>
      <span>确认授权表示同意<a href="https://s.qfpay.com.cn/docs/32bead2b3a0c739de218a546385d6cf2.html">《用户授权协议》</a></span>
    </p>
    <button class="modify-btn" type="button" :disabled="isDisabled" @click="submit()">确定</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import utils from 'methods/util'

  export default {
    data () {
      return {
        isDisabled: false,
        value: true
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        this.$Indicator.open()
        this.$http({
          url: `${config.oHost}mchnt/oauth/supplied`,
          method: 'GET',
          params: {
            format: 'cors'
          }
        }).then(response => {
          this.$Indicator.close()
          let res = response.data
          if (res.respcd === '0000') {
            if (res.data.is_auth_lst === 1) {
              window.location.href = 'https://8.1688.com/wap/third.htm?thirdp=qfzf'
            } else {
              utils.setTitle('用户授权')
            }
          }
        })
      },
      submit() {
        this.$router.push({name: 'form'})
      },
      checkedBox: function (e) {
        this.isDisabled = !e.target.checked
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  @import "../../../styles/base/var.scss";
  .wrapper {
    background-color: $white;
    border-top: 2px solid $lightGray;
    border-bottom: 2px solid $lightGray;
    margin-top: 30px;
    padding: 0 30px 200px;
    height: calc(100vh - 30px);
    box-sizing: border-box;
    font-size: 26px;
    img {
      width: 50%;
      display: block;
      margin: -3px auto 30px;
    }
    ul {
      padding-left: 40px;
      li {
        margin-bottom: 40px;
      }
      i {
        width: 210px;
        height: 96px;
        display: inline-block;
        background: url("../assets/dkhs.png") no-repeat center center;
        &.duo { background-position: 0 4px; }
        &.kuai { background-position: 0 -120px; }
        &.hao { background-position: 0 -240px; }
        &.sheng { background-position: 0 -366px; }
        background-size: auto 480%;
      }
      p {
        width: 60%;
        display: inline-block;
      }
      i, p {
        vertical-align: middle;
      }
    }
    .info {
      color: #9B9B9B;
      padding-top: 30px;
      border-top: 4px dashed $lightGray;
    }
    .agreement {
      text-align: center;
      font-size: 30px;
      margin-top: 36px;
      color: #606470;
      line-height: 3.5;
      a {
        color: #000;
      }
    }
  }
  input[type='checkbox'], span {
    vertical-align: middle;
  }
  input[type='checkbox'] {
    width: 36px;
    height: 36px;
    margin-right: 8px;
    cursor: pointer;
    border: 2px solid #979797;
    appearance: none;
    outline: none;
    background-color: #fff;
    border-radius: 100%;
    &:checked {
      border: none;
      background: #ff8100 url("../assets/checked.svg") no-repeat center center;
      background-size: 62% 100%;
    }
  }
  .modify-btn {
    border-radius: 6px;
  }
</style>
