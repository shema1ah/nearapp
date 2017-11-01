<template>
  <div class="container">
    <div class="item no-arrow">
      <em>接单状态</em>
      <span>
        <i :class="{'red': !settings.delivery_open_state, 'green': settings.delivery_open_state}">{{stateText}}</i>
        <checkbox :value="settings.delivery_open_state"></checkbox>
      </span>
    </div>
    <div class="item multi-line" @click="editShopInfo">
      <em>店铺信息</em>
      <span>{{settings.telephone}}<br/>{{settings.province}} {{settings.city}}<br/>{{settings.address}}</span>
    </div>
    <div class="item" @click="showDeliveryTime">
      <em>配送时段</em>
      <span>{{settings.start_time | subStr(5)}}-{{settings.end_time | subStr(5)}}</span>
    </div>
    <div class="item" @click="editFee">
      <em>配送费规则</em>
      <span v-if="settings.start_delivery_fee || settings.shipping_fee || settings.min_shipping_fee">
        <span v-if="settings.start_delivery_fee"><i>{{settings.start_delivery_fee | formatCurrency | noZeroCurrency}}</i>元起送<span v-if="settings.shipping_fee">，</span></span>
        <span v-if="settings.shipping_fee">配送费<i>{{settings.shipping_fee | formatCurrency | noZeroCurrency}}</i>元/单<br/></span>
        <span style="display:block" v-if="settings.min_shipping_fee">每单满<i>{{settings.min_shipping_fee | formatCurrency | noZeroCurrency}}</i>元，免配送费</span>
      </span>
      <span v-else>免配送费</span>
    </div>
    <div class="item" :class="{'no-bb':settings.max_shipping_dist}" @click="editScope">
      <em>配送范围</em>
      <span v-if="settings.max_shipping_dist">{{settings.max_shipping_dist | formatDistance}}公里</span>
      <span v-else>不限配送范围</span>
    </div>
    <dtime :visible="deliverTimeVisible"></dtime>
    <map :location="switchLocation" :distance="formatDistance" :visible="settings.max_shipping_dist" @click="editScope"></map>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import mapImg from './mapImg.vue'
  import checkbox from 'components/input/checkbox.vue'
  import dtime from './delivery-time.vue'
  import bridge from 'methods/bridge-v2'
  export default {
    data () {
      return {
        deliverTimeVisible: false
      }
    },
    created () {
      console.log('created')
      console.log(this.settings)
    },
    computed: {
      settings () {
        return this.$store.getters.getSettings
      },
      stateText () {
        return this.$store.state.settings.delivery_open_state ? '接单中' : '暂停中'
      },
      switchLocation () {
        return `${this.$store.state.settings.longitude},${this.$store.state.settings.latitude}`
      },
      formatDistance () {
        return isNaN(this.$store.state.settings.max_shipping_dis) ? '' : (this.$store.state.settings.max_shipping_dis / 1000).toFixed(1)
      }
    },
    components: {
      checkbox, dtime, mapImg
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
            newSettings = Object.assign(_this.$store.state.settings, newSettings)
            _this.$store.commit('UPDATESETTINGS', newSettings)
          }
        })
      },
      showDeliveryTime () {
        this.deliverTimeVisible = true
      },
      editFee () {
        this.$router.push({name: 'fee'})
      },
      editScope () {
        this.$router.push({
          name: 'scope',
          query: {
            longitude: this.$store.state.settings.longitude,
            latitude: this.$store.state.settings.latitude,
            distance: this.$store.state.settings.max_shipping_dist / 1000
          }})
      },
      oncheckboxchange (val) {
        this.$http({
          url: `${config.dcHost}diancan/mchnt/modifydeliverystate`,
          method: 'POST',
          params: {
            format: 'cors',
            delivery_open_state: val,
            id: this.$store.state.settings.ID
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            this.$store.state.settings.delivery_open_state = val
            this.$store.dispatch('UPDATESETTINGS', this.settings)
          } else {
            this.toast(res.resperr)
          }
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
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
</style>
