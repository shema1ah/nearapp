<template>
  <div class="container">
    <div class="item no-arrow">
      <em>接单状态</em>
      <span>
        <i :class="{'red': !deliveryState, 'green': deliveryState}">{{deliveryState ? '接单中' : '暂停中'}}</i>
        <checkbox :value="deliveryState" @oncheckboxchange="oncheckboxchange"></checkbox>
      </span>
    </div>
    <div class="item" @click="goautoorder()">
      <em>自动接单</em>
      <span>{{auto_order}}</span>
    </div>
    <div class="item multi-line" @click="editShopInfo">
      <em>店铺信息</em>
      <span>{{settings.telephone}}<br/>{{settings.province}} {{settings.city}}<br/>{{settings.address}}</span>
    </div>
    <div class="item" @click="showDeliveryTime()">
      <em>配送时段</em>
      <ul class="timelist">
        <li v-for="item in durationsArr">{{item.start_time | subStr(5)}}~{{item.end_time | subStr(5)}}</li>
      </ul>
    </div>
    <div class="item multi-line" @click="editRegular" :class="{'no-arrow' : settings.distribution}">
      <em>配送规则</em>
      <span v-if="settings.distribution">由 达达同城 配送</span>
      <span v-else-if="settings.rules && !settings.rules.length"></span>
      <span v-else-if="settings.ID && settings.rules.length > 1">共 <i>{{settings.rules.length}}</i> 个</span>
      <span v-else-if="rule.start_delivery_fee || rule.shipping_fee || rule.min_shipping_fee">
        <span v-if="!settings.dist_switch" style="display:block">不限制配送范围</span>
        <span v-if="rule.start_delivery_fee"><i>{{rule.start_delivery_fee | formatCurrency}}</i>元起送<span v-if="rule.shipping_fee">，</span></span>
        <span v-if="rule.shipping_fee">配送费<i>{{rule.shipping_fee | formatCurrency}}</i>元/单<br/></span>
        <span style="display:block" v-if="rule.min_shipping_fee">每单满<i>{{rule.min_shipping_fee | formatCurrency}}</i>元，免配送费</span>
      </span>
      <span v-else>免配送费</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import checkbox from 'components/input/checkbox.vue'
  import bridge from 'methods/bridge-v2'
  import utils from 'methods/util'
  export default {
    data () {
      return {
        deliverTimeVisible: false
      }
    },
    created () {
      utils.setTitle('外卖设置')
      this.disableRefresh()
    },
    computed: {
      deliveryState () {
        return this.$parent.deliveryState
      },
      settings () {
        return this.$store.getters.getSettings
      },
      rule () {
        // computed 会先于接口返回 执行
        if (!utils.isEmptyObject(this.settings)) {
          // 不限制配送范围时候，使用第一条配送规则
          return this.settings.rules[0]
        } else {
          // 没拿到数据之前，先初始化的数据
          return {
            start_delivery_fee: 0
          }
        }
      },
      auto_order () {
        return this.settings.auto_order_switch ? '已开启' : '已关闭'
      },
      switchLocation () {
        return `${this.settings.longitude},${this.settings.latitude}`
      },
      formatDistance () {
        return isNaN(this.settings.max_shipping_dis) ? '' : (this.settings.max_shipping_dis / 1000).toFixed(1)
      },
      durationsArr () {
        return this.settings.durations
      }
    },
    components: {
      checkbox
    },
    methods: {
      editShopInfo () {
        let newSettings = {}
        let _this = this
        bridge.openUri({
          uri: 'nearmcht://view-edit-shop-info'
        }, function (cb) {
          let data = cb.data
          if (data.status) {
            if (data.longitude && data.latitude) {
              newSettings.longitude = data.longitude
              newSettings.latitude = data.latitude
            }
            if (data.address) {
              newSettings.address = data.address
            }
            if (data.phone) {
              newSettings.telephone = data.phone
            }
            newSettings = Object.assign(_this.settings, newSettings)
            _this.$store.commit('UPDATESETTINGS', newSettings)
          }
        })
      },
      disableRefresh () {
        bridge.pageRefresh({
          close: '1'
        })
      },
      showDeliveryTime () {
        this.$router.push({name: 'deliverytimelist'})
      },
      hideDeliveryTime () {
        this.deliverTimeVisible = false
      },
      editRegular () {
        if (this.settings.distribution) {
          return false
        }
        this.$router.push({name: 'deliveryregular'})
      },
      oncheckboxchange (val) {
        this.$parent.deliveryState = val
        this.$http({
          url: `${config.oHost}diancan/mchnt/modifydeliverystate`,
          method: 'POST',
          params: {
            format: 'cors',
            delivery_open_state: val,
            id: this.settings.ID || window.localStorage.getItem('settingId')
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '2101') {
            let instance = this.$toast('请先完善配送信息')
            let _this = this
            setTimeout(function () {
              _this.$parent.deliveryState = 0
              instance.close()
            }, 800)
          } else if (res.respcd === '0000') {
            // this.$store.commit('UPDATESTATUS', val)
          } else {
            this.$parent.deliveryState = val ? 0 : 1
            this.$toast(res.resperr)
          }
        })
      },
      goautoorder () {
        this.$router.push({name: 'autoorder'})
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
.timelist {
  flex: 1;
  li {
    text-align: right;
    color: #2F323A;
  }
}
</style>
