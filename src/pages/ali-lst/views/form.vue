<template lang="html">
  <div class="wrapper">
    <p class="tips"><i>*</i>为了保证进货体验和售后服务，请您将以下信息补充完整，并确保无误。</p>
    <ul class="container">
      <li class="item">
        <em>店铺名称</em>
        <input type="text"  v-model="info.storeName">
      </li>
      <li class="item">
        <em>营业执照号</em>
        <input type="text" :readonly="hasLicenseNo" v-model="info.licenseNo">
      </li>
      <li class="item">
        <em>联系人姓名</em>
        <input type="text" v-model="info.contactPerson">
      </li>
      <li class="item">
        <em>联系人手机号</em>
        <input type="text" v-model="info.mobile">
      </li>
      <li class="item has-arrow" @click="goSelectLocation()">
        <em>收货所在地区</em>
        <span :class="{'default': !location}">{{location ? location : '请选择'}}</span>
      </li>
      <li class="item has-arrow" @click="goSelectStreet()">
        <em>街道</em>
        <span :class="{'default': !info.street}">{{info.street ? info.street : '请选择'}}</span>
      </li>
      <li class="item">
        <textarea placeholder="请填写详细地址，精确到门牌号" v-model="detail"></textarea>
      </li>
    </ul>
    <button class="modify-btn" :disabled="isDisabled" type="button" @click="verify()">确定</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import utils from 'methods/util'

  export default {
    data () {
      return {
        detail: '',
        isDisabled: false
      }
    },
    created () {
      utils.setTitle('补充信息')
    },
    computed: {
      info() {
        return this.$store.getters.getInfo
      },
      location() {
        return this.info.province + this.info.city + this.info.area
      },
      hasLicenseNo() {
        return this.$root.hasLicenseNo
      }
    },
    methods: {
      submit() {
        this.isDisabled = true
        this.$Indicator.open()
        let params = Object.assign(this.info, {
          format: 'cors',
          detail: this.detail
        })
        this.$http({
          url: `${config.oHost}mchnt/oauth/supplyinfo`,
          method: 'POST',
          params
        }).then(response => {
          this.isDisabled = false
          this.$Indicator.close()
          let res = response.data
          if (res.respcd === '0000') {
            window.location.href = 'https://8.1688.com/wap/third.htm?thirdp=qfzf'
          } else {
            this.$toast(res.resperr)
          }
        })
      },
      verify() {
        if (!this.info.storeName || !this.info.contactPerson || !this.info.mobile || !this.info.province || !this.info.street) {
          this.$toast('请将信息补充完整')
        } else if (this.info.licenseNo.length !== 15 && this.info.licenseNo.length !== 18) {
          this.$toast('营业执照号格式不正确')
        } else {
          this.submit()
        }
      },
      goSelectLocation() {
        this.$router.push({name: 'local'})
      },
      goSelectStreet() {
        if (this.location) {
          this.$router.push({
            name: 'local',
            query: {
              from: 'street'
            }
          })
        } else {
          this.$toast('请先选择省市再选择街道')
        }
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  .tips {
    color: #606470;
    font-size: 26px;
    padding: 24px 30px;
    i {
      color: #ff8100;
      margin-right: 12px;
      font-style: normal;
    }
  }
  .container {
    background-color: #fff;
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
    padding-left: 30px;
  }
  .item {
    font-size: 30px;
    padding: 24px 30px 24px 0;
    border-bottom: 2px solid #E5E5E5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:last-child {
      border-bottom: none;
    }
    &.has-arrow {
      background:url('../assets/arrow.svg') no-repeat right 26px center;
      background-size: 15px auto;
      padding-right: 54px;
      .default {
        color: #A7A9AE;
      }
    }
    em, > span, input {
      display: block;
    }
    em {
      font-style: normal;
      color: #606470;
    }
    > span, input {
      text-align: right;
      flex: 1;
    }
    input, textarea {
      font-size: inherit;
      &::placeholder {
        color: #A7A9AE;
      }
    }
    textarea {
      width: 100%;
      min-height: 1.5rem;
    }
  }
  input[type=text]:readonly {
    color: #A7A9AE;
  }
  .modify-btn {
    position: fixed;
    bottom: 0;
    left: 0;
  }
</style>
