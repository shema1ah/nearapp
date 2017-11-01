<template>
  <div class="container">
    <ul class="has-bb">
     <li>
       <em>起送价</em>
       <span>
         <input type="number" class="tel-input" placeholder="请输入金额" :value="start_delivery_fee" @input="updatestart_fee($event)"> 元
       </span>
     </li>
     <li>
       <em>配送费</em>
       <span>
         <input type="number" class="tel-input" placeholder="请输入金额" :value="shipping_fee" @input="updateshipping_fee($event)"> 元
       </span>
     </li>
     <li>
       <em>满减免配送费</em>
       <span>
         <checkbox :value="isImmediately" @checkbox_change></checkbox>
       </span>
     </li>
     <li v-show="isImmediately">
       每单满<input type="number" :value="min_shipping_fee"
       class="border-input" :class="{'active': settings.min_shipping_fee}" @input="updatemin_fee($event)">元，免配送费
     </li>
    </ul>
    <button @click="saveFee" class="modify-btn" type="button">保存</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import store from '../vuex/store'
  import config from 'methods/config'
  import checkbox from 'components/input/checkbox.vue'
  export default {
    components: {checkbox},
    data () {
      return {
        isImmediately: this.$store.settings.min_shipping_fee !== 0,
        shipping_fee: this.$store.settings.shipping_fee,
        start_delivery_fee: this.$store.settings.start_delivery_fee,
        min_shipping_fee: this.$store.settings.min_shipping_fee
      }
    },
    computed: {
      settings () {
        return this.$store.getters.getSettings
      },
      start_delivery_fee () {
        return !this.start_delivery_fee ? '' : Number((this.start_delivery_fee / 100).toFixed(2))
      },
      shipping_fee () {
        return !this.shipping_fee ? '' : Number((this.shipping_fee / 100).toFixed(2))
      },
      min_shipping_fee () {
        return !this.min_shipping_fee ? '' : Number((this.min_shipping_fee / 100).toFixed(2))
      }
    },
    methods: {
      // 更新状态库
      updatestart_fee (e) {
        this.$store.state.commit('UPDATESTARTFEE', Number(e.target.value * 100))
      },
      updateshipping_fee (e) {
        this.$store.state.commit('UPDATESHIPPINGFEE', Number(e.target.value * 100))
      },
      updatemin_fee (e) {
        this.$store.state.commit('UPDATEMINFEE', Number(e.target.value * 100))
      },
      saveFee () {
        // // 更新状态库 store
        // if (Number(this.$refs.start_delivery_fee.value * 100) !== this.start_delivery_fee) {
        //   store.commit('UPDATESTARTFEE', this.$refs.start_delivery_fee.value)
        // }
        // if (Number(this.$refs.shipping_fee.value * 100) !== this.shipping_fee) {
        //   store.commit('UPDATESHIPPINGFEE', this.$refs.shipping_fee.value)
        // }
        // if (Number(this.$refs.min_shipping_fee.value * 100) !== this.min_shipping_fee) {
        //   store.commit('UPDATEMINFEE', this.$refs.min_shipping_fee.value)
        // }
        this.$http({
          url: `${config.dcHost}diancan/mchnt/editsetting`,
          method: 'POST',
          params: {
            start_delivery_fee: this.settings.start_delivery_fee,
            shipping_fee: this.settings.shipping_fee,
            min_shipping_fee: this.settings.min_shipping_fee,
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            store.dispatch('UPDATESETTINGS', this.settings)
            window.history.go(-1)
          } else {
            this.$toast(res.resperr)
          }
        })
      },
      checkbox_change (val) {
        this.isImmediately = val
        if (!val) {
          this.settings.min_shipping_fee = 0
        }
      }
    }
  }
</script>

<style scoped lang="scss" type="scss" rel="stylesheet/scss">
  .container {
    padding-top: 24px;
    padding-bottom: 110px;
  }
</style>
