<template lang="html">
  <!-- <transition :name="'slide-' + (direction === 'forward' ? 'in' : 'out')"> -->
    <router-view class="child-view"></router-view>
  <!-- </transition> -->
</template>

<script type="text/ecmascript-6">
import config from 'methods/config'
export default {
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    settings () {
      return this.$store.getters.getSettings
    },
    direction () {
      return this.$store.state.direction
    }
  },
  methods: {
    addrequest (startTime, endTime) {
      let duration = {
        start_time: startTime,
        end_time: endTime
      }
      this.$http({
        url: `${config.oHost}diancan/mchnt/editdurations`,
        method: 'POST',
        params: {
          duration: JSON.stringify(duration),
          action: 'add',
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          duration.duration_id = res.data.duration_id
          this.$store.commit('ADDDURATION', duration)
        } else {
          this.$toast(res.resperr)
        }
      })
    },
    addrequestfee (merchantInfo) {
      let rule = {
        max_shipping_dist: merchantInfo.max_shipping_dist,
        min_shipping_fee: merchantInfo.min_shipping_fee,
        shipping_fee: merchantInfo.shipping_fee,
        start_delivery_fee: merchantInfo.start_delivery_fee
      }
      this.$http({
        url: `${config.oHost}diancan/mchnt/editrules`,
        method: 'POST',
        params: {
          rule: JSON.stringify(rule),
          action: 'add',
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          rule.rule_id = res.data.rule_id
          this.$store.commit('ADDRULE', rule)
        } else {
          this.$toast(res.resperr)
        }
      })
    }
  },
  mounted () {
    let _this = this
    this.$http({
      url: `${config.oHost}diancan/mchnt/settings`,
      method: 'JSONP',
      params: {
        format: 'jsonp'
      }
    }).then((response) => {
      let res = response.data
      let merchantInfo = res.data.merchant_info
      if (res.respcd === '0000') {
        this.$store.commit('UPDATESETTINGS', merchantInfo)
        if (!merchantInfo.durations.length && (merchantInfo.start_time || merchantInfo.end_time)) {
          _this.addrequest(merchantInfo.start_time, merchantInfo.end_time)
        }
        if (!merchantInfo.rules.length && merchantInfo.shipping_fee) {
          _this.addrequestfee(merchantInfo)
        }
        if (merchantInfo.telephone && merchantInfo.longitude) {
          this.$router.replace({name: 'main'})
        } else {
          this.$router.replace({name: 'verify'})
        }
      } else {
        this.$toast(res.resperr)
      }
    })
  }
}
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
@import "../../styles/global.scss";

body {
  background-color: #f7f7f7;
}
.tel-input {
  width: 80%;
  height: 42px;
  font-size: 30px;
  text-align: right;
  border: none;
  padding: 0 10px 0 0;
  &:focus {
    outline: none;
  }
  &::-webkit-input-placeholder {
    color: #A7A9AE;
  }
}
.border-input {
  width: 90px;
  height: 56px;
  margin:0 10px;
  border: 2px solid #D8D8D8;
  border-radius: 6px;
  vertical-align: inherit;
  font-size: 30px;
  text-align: center;
  font-weight: 400;
  padding: 0;
  &.active {
    border-color: #FF8100;
  }
  &.warn {
    border-color: #FF2F00;
  }
}
.modify-btn {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  cursor: pointer;
  padding: 0;
  height: 90px;
  border: none;
  background-color: #FF8100;
  color: #fff;
  font-size: 32px;
}
.has-bb {
  border-bottom: 2px solid #E5E5E5;
}
.touch-btn {
  width: 44px;
  height: 44px;
  color: #A7A9AE;
  padding: 0;
  border: 2px solid #A7A9AE;
  background-color: #fff;
  border-radius: 6px;
  line-height: 1;
  i {
    font-size: 26px;
  }
  &:disabled {
    opacity: 0.5;
  }
}
.item {
  font-size: 30px;
  padding: 24px 54px 24px 30px;
  margin-top: 18px;
  border-top: 2px solid #E5E5E5;
  border-bottom: 2px solid #E5E5E5;
  background:#fff url('assets/arrow.svg') no-repeat right 26px center;
  background-size: 15px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.multi-line {
    min-height: 58px;
    padding-top: 16px;
    padding-bottom: 16px;
  }
  &.no-bb {
    border-bottom: none;
  }
  em, > span {
    display: block;
  }
  em {
    font-style: normal;
    color: #606470;
  }
  > span {
    color: #2F323A;
    text-align: right;
    max-width: 75%;
    i {
      font-style: normal;
      color: #FF8100;
    }
  }
}
.no-arrow {
  padding-right: 30px;
  background-image: none;
  background-color: #fff;
}
.item i {
  &.green {
    color: #1EC622;
  }
  &.red {
    color: #FD5359;
  }
}
.mint-toast-text {
  font-size: 24px;
  margin: 10px 20px;
}
// 场景过渡动画样式
.slide-out-enter-active,
.slide-out-leave-active,
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all .3s ease;
  height: 100%;
  top: 0;
  position: absolute;
}

.slide-out-enter {
  transform: translate3d(-100%, 0, 0);
}

.slide-out-leave-active {
  transform: translate3d(100%, 0, 0);
}

.slide-in-enter {
  transform: translate3d(100%, 0, 0);
}

.slide-in-leave-active {
  transform: translate3d(-100%, 0, 0);
}
</style>
