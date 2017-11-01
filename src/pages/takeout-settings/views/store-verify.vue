<template>
  <div class="container">
    <div @click="goUpdate" class="item">
      <em>店铺电话</em>
      <span>{{settings.telephone}}</span>
    </div>
    <p v-if="!settings.telephone" class="tip"><i>＊</i>请提供准确的联系电话，确保消费者能及时联系店铺。</p>
    <div @click="goUpdate" class="item multi-line">
      <em>店铺地址</em>
      <span>{{settings.province}} {{settings.city}}<br/>{{settings.address}}</span>
    </div>
    <p v-if="!settings.longitude" class="tip"><i>＊</i>目前没有获取到您的店铺经纬度，为确保配送范围更加精准，请重新“编辑”店铺地址。</p>
    <button @click="goUpdate" class="modify-btn" type="button">编辑</button>
  </div>

</template>

<script type="text/ecmascript-6">
  import { getSettings } from '../vuex/getters'
  import bridge from '../../../methods/bridge-v2'
  export default {
    data () {
      return {
      }
    },
    vuex: {
      getters: {
        settings: getSettings
      }
    },
    methods: {
      goUpdate () {
        let _this = this
        let newSettings = {}
        bridge.openUri({
          uri: 'nearmcht://view-edit-shop-info'
        }, function (cb) {
          if (cb.data.status) {
            newSettings = Object.assign(_this.settings, cb.data, {telephone: cb.data.phone})
            _this.$store.dispatch('UPDATESETTINGS', newSettings)
            if (cb.data.longitude && cb.data.phone) {
              _this.$router.replace({name: 'main'})
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
.tip {
  font-size: 24px;
  color: #A7A9AE;
  padding: 10px 30px;
  margin-bottom: 16px;
  i {
    font-style: normal;
    color: #FF8100;
  }
}
</style>
