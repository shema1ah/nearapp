<template>
  <div class="container">
    <ul class="has-bb">
     <li>
       <em>起送价</em>
       <span>
         <input type="number" class="tel-input" placeholder="请输入金额" :value="start_delivery_fee" ref="start_fee"> 元
       </span>
     </li>
     <li>
       <em>配送费</em>
       <span>
         <input type="number" class="tel-input" placeholder="请输入金额" :value="shipping_fee" ref="shipping_fee"> 元
       </span>
     </li>
     <li>
       <em>满减免配送费</em>
       <span>
         <checkbox :value="isImmediately" @oncheckboxchange="oncheckboxchange"></checkbox>
       </span>
     </li>
     <li v-show="isImmediately">
       每单满<input type="number" :value="min_shipping_fee"
       class="border-input" :class="{'active': min_shipping_fee}" ref="minshippingfee">元，免配送费
     </li>
    </ul>
    <button @click="saveFee" class="modify-btn" type="button">保存</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import checkbox from 'components/input/checkbox.vue'
  export default {
    components: {checkbox},
    data () {
      return {
        isImmediately: false
      }
    },
    mounted () {
      this.isImmediately = this.settings.min_shipping_fee !== 0
    },
    computed: {
      settings () {
        return this.$store.getters.getSettings
      },
      start_delivery_fee () {
        return !this.settings.start_delivery_fee ? '' : Number((this.settings.start_delivery_fee / 100).toFixed(2))
      },
      shipping_fee () {
        return !this.settings.shipping_fee ? '' : Number((this.settings.shipping_fee / 100).toFixed(2))
      },
      min_shipping_fee () {
        return !this.settings.min_shipping_fee ? '' : Number((this.settings.min_shipping_fee / 100).toFixed(2))
      }
    },
    methods: {
      saveFee () {
        let startdeliveryfee = this.$refs.start_fee.value * 100 || 0
        let shippingfee = this.$refs.shipping_fee.value * 100 || 0
        let minshippingfee = this.$refs.minshippingfee.value * 100 || 0
        this.$http({
          url: `${config.dcHost}diancan/mchnt/editsetting`,
          method: 'POST',
          params: {
            start_delivery_fee: startdeliveryfee,
            shipping_fee: shippingfee,
            min_shipping_fee: minshippingfee,
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            this.$store.commit('UPDATESTARTFEE', startdeliveryfee)
            this.$store.commit('UPDATESHIPPINGFEE', shippingfee)
            this.$store.commit('UPDATEMINFEE', minshippingfee)
            window.history.go(-1)
          } else {
            this.$toast(res.resperr)
          }
        })
      },
      oncheckboxchange (val) {
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
