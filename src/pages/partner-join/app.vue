<template lang="html">
  <div class="wrapper">
    <div class="photo">
      <img src="./assets/bg.png" alt="bg">
    </div>
    <div class="bottom-button" @click="showForm()">
      <img src="./assets/button.png" alt="button">
    </div>
    <!-- style="display:none;" -->
    <div class="outer" v-show="formVisible" style="display:none">
      <form class="infoForm">
        <h1>请输入免费获取<img @click="closedFrom()" src="./assets/closed.svg"></h1>
        <ul>
          <li>
            <em>姓名</em>
            <input type="text" @blur="nameBlur($event)" v-model="info.name">
            <p class="tip" v-show="nameTipVisible" style="display:none">请填写姓名</p>
            <p class="tip" v-show="nameLengthTipVisible" style="display:none">不能超过11个字符</p>
          </li>
          <li>
            <em>手机</em>
            <input @blur="mobileBlur($event)" type="tel" v-model="info.contact_mobile" maxlength="11">
            <p class="tip" v-show="tipVisible" style="display:none">手机格式不正确</p>
          </li>
          <li>
            <em>公司</em>
            <input type="text" v-model="info.company">
          </li>
        </ul>
        <footer>
          <button type="button" @click="submit()">立即提交</button>
        </footer>
      </form>
    </div>
    <div class="outer" v-show="resultVisible" style="display:none">
      <div class="result" style="display:none" v-show="resultVisible">
        <img src="./assets/success.png">
        <h3>恭喜你提交成功</h3>
        <p>我们会尽快跟您核实并发放邀请码<br>请凭邀请码入场</p>
        <button type="button" class="btn" @click="viewPlan()">查看议程</button>
        <a class="mobile" href="tel:010-52857274">咨询电话<span>010-52857274</span></a>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable no-irregular-whitespace */
/* global _czc */
import util from 'methods/util'
import config from 'methods/config'

export default {
  data () {
    return {
      info: {
        name: '',
        contact_mobile: '',
        company: ''
      },
      formVisible: false,
      resultVisible: false,
      nameTipVisible: false,
      nameLengthTipVisible: false,
      tipVisible: false,
    }
  },
  created () {
    let querys = util.getRequestParams()
    this.info = Object.assign(this.info, querys)
  },
  methods: {
    showForm() {
      _czc.push(﻿['_trackEvent', 'sz-partner', 'show', 'form'])
      document.querySelector('body').classList.add('popup-open')
      this.formVisible = true
    },
    closedFrom () {
      document.querySelector('body').classList.remove('popup-open')
      this.formVisible = false
    },
    nameBlur (e) {
      if (!e.target.value) {
        this.nameTipVisible = true
        this.nameLengthTipVisible = false
      } else if (e.target.value.length > 11) {
        this.nameLengthTipVisible = true
        this.nameTipVisible = false
      } else {
        this.nameTipVisible = false
        this.nameLengthTipVisible = false
      }
    },
    mobileBlur (e) {
      let mobileReg = /^\d{11}$/
      if (!e.target.value.match(mobileReg)) {
        this.tipVisible = true
      } else {
        this.tipVisible = false
      }
    },
    submit () {
      if (!this.info.name) {
        this.nameTipVisible = true
        return false
      } else if (!/^\d{11}$/.test(this.info.contact_mobile)) {
        this.tipVisible = true
        return false
      }
      let params = Object.assign(this.info, {
        format: 'cors',
        coop_type: 1,
        city: '深圳'
      })
      this.$http({
        url: `${config.oHost}mchnt/intentcoopman/add`,
        method: 'POST',
        params
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          _czc.push(﻿['_trackEvent', 'sz-partner', 'submit', 'form'])
          this.formVisible = false
          this.resultVisible = true
        } else {
          window.alert(res.resperr)
        }
      })
    },
    viewPlan () {
      _czc.push(﻿['_trackEvent', 'sz-partner', 'view', 'plan'])
      window.location.href = 'http://www.hdb.com/party/3qpo2.html?hdb_pos=manager_info' // 查看议程的链接
    }
  }
}
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
@import "../../styles/base/reset";
@import "../../styles/base/layout";
// 移动端滚动穿透问题
body > a {
  display: none;
}
body.popup-open {
  position: fixed;
  width: 100%;
}
.wrapper {
  .photo {
    img {
      width: 100%;
    }
  }
  .bottom-button {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    cursor: pointer;
    padding: 0;
    border: none;
    img {
      width: 100%;
    }
  }
}
.outer {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.infoForm {
  width: 90%;
  margin-top: -10vh;
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
  h1 {
    position: relative;
    text-align: center;
    line-height: 3;
    font-weight: normal;
    font-size: 36px;
    color: #000;
    background-color: #EDF8FE;
    img {
      height: 45px;
      width: 45px;
      cursor: pointer;
      right: 30px;
      top: 30px;
      position: absolute;
    }
  }
  ul {
    padding: 45px 45px 0;
  }
  li {
    font-size: 30px;
    position: relative;
    padding-bottom: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    em {
      width: 90px;
      font-style: normal;
      color: #606470;
    }
    input {
      flex: 1;
      border: 2px solid #A8DDFA;
      padding: 20px 0 20px 20px;
      border-radius: 6px;
      font-size: 30px;
      &::placeholder {
        color: #A7A9AE;
      }
    }
  }
  footer {
    text-align: center;
    padding: 0 45px 70px;
    button {
      height: 82px;
      width: 100%;
      font-weight: 300;
      border-radius: 6px;
      margin: 0 auto;
      background-color: #52BCF6;
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
  }
}
.tip {
  position: absolute;
  bottom: 10px;
  left: 100px;
  font-size: 24px;
  line-height: 1.5;
  color: #fd5359;
}
.result {
  width: 80%;
  margin-top: -10vh;
  background-color: #fff;
  border-radius: 16px;
  text-align: center;
  padding: 90px 30px 60px;
  color: #606470;
  font-size: 28px;
  > img {
    width: 132px;
    vertical-align: bottom;
  }
  h3 {
    color: #000;
    font-size: 36px;
    font-weight: normal;
    margin: 30px 0 30px;
  }
  .btn {
    height: 82px;
    width: 100%;
    font-weight: 300;
    margin: 60px 0 30px;
    border-radius: 6px;
    background-color: #52BCF6;
    color: #fff;
    font-size: 30px;
    cursor: pointer;
  }
  .mobile {
    color: #606470;
    span {
      text-decoration: underline;
      color: #52BCF6;
      margin-left: 20px;
    }
  }
}
</style>
