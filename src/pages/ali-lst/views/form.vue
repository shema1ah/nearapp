<template lang="html">
  <div class="wrapper">
    <p class="tips"><i>*</i>为了保证进货体验和售后服务，请您将以下信息补充完整,并确保无误。</p>
    <ul class="container">
      <li class="item">
        <em>店铺名称</em>
        <input type="text" placeholder="" v-model="storeName">
      </li>
      <li class="item">
        <em>营业执照号</em>
        <input type="text" readonly value="licenseNo">
      </li>
      <li class="item">
        <em>联系人姓名</em>
        <input type="text" placeholder="" v-model="contactPerson">
      </li>
      <li class="item">
        <em>联系人手机号</em>
        <input type="text" placeholder="" v-model="mobile">
      </li>
      <li class="item has-arrow" @click="goSelectAreas()">
        <em>收货所在地区</em>
        <span :class="{'default': !location}">{{location ? location : '请选择'}}</span>
      </li>
      <li class="item has-arrow" @click="goSelectStreet()">
        <em>街道</em>
        <span :class="{'default': !street}">{{street ? street : '请选择'}}</span>
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

  export default {
    data () {
      return {
        storeName: '',
        licenseNo: '',
        contactPerson: '',
        mobile: '',
        detail: '',
        isDisabled: false
      }
    },
    created () {
      this.getData()
    },
    computed: {
      location () {
        return this.$root.province + this.$root.city + this.$root.area
      },
      street () {
        return this.$root.street
      }
    },
    methods: {
      getData () {
        this.$Indicator.open()
        this.$http({
          url: `${config.oHost}mchnt/oauth/supplied`,
          method: 'GET'
        }).then(response => {
          this.$Indicator.close()
          let res = response.data
          if (res.respcd === '0000') {
            this.storeName = res.data.storeName
            this.licenseNo = res.data.licenseNo
            this.contactPerson = res.data.contactPerson
            this.mobile = res.data.mobile
          } else {
            this.$toast(res.resperr)
          }
        })
      },
      submit() {
        this.isDisabled = true
        this.$Indicator.open()
        this.$http({
          url: `${config.oHost}mchnt/oauth/supplyinfo`,
          method: 'POST',
          params: {
            storeName: this.storeName,
            licenseNo: this.licenseNo,
            contactPerson: this.contactPerson,
            mobile: this.mobile,
            detail: this.detail,
            province: this.$root.province,
            city: this.$root.city,
            area: this.$root.area,
            street: this.$root.street
          }
        }).then(response => {
          this.isDisabled = false
          this.$Indicator.close()
          let res = response.data
          if (res.respcd === '0000') {
            this.$toast('保存成功')
          } else {
            this.$toast(res.resperr)
          }
        })
      },
      verify() {
        if (!this.storeName || !this.contactPerson || !this.mobile || !this.$root.province || !this.$root.street) {
          this.$toast('请将信息补充完整')
        } else {
          this.submit()
        }
      },
      goSelectAreas() {
        this.$router.push({name: 'local'})
      },
      goSelectStreet() {
        if (this.$root.area) {
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
  .modify-btn {
    position: fixed;
    bottom: 0;
    left: 0;
  }
</style>
