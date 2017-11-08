<template>
  <div class="container">
    <ul class="has-bb list">
      <li v-if="limitDist">
        <em>配送范围</em>
        <span>
          <button type="button" class="touch-btn" :disabled="distance <= minDistance || distance > maxDistance ? 'disabled' : false" @click="reduceDistance"><i class="iconfont">&#xe601;</i></button>
          <input type="tel" @blur="distanceBlur" :class="{warn: (distance > maxDistance)}" class="border-input" v-model="distance"/>
          <button type="button" class="touch-btn" :disabled="distance >= maxDistance || distance < minDistance ? 'disabled' : false" @click="addDistance"><i class="iconfont">&#xe600;</i></button>
          公里
        </span>
      </li>
     <li>
       <em>起送价</em>
       <span>
         <input type="tel" class="tel-input" placeholder="请输入金额" :value="rule.start_delivery_fee | formatCurrency | noZeroCurrency" ref="startfee"/> 元
       </span>
     </li>
     <li>
       <em>配送费</em>
       <span>
         <input type="tel" class="tel-input" placeholder="请输入金额" :value="rule.shipping_fee | formatCurrency | noZeroCurrency" ref="shippingfee"/> 元
       </span>
     </li>
     <li>
       <em>满减免配送费</em>
       <span>
         <checkbox :value="isImmediately" @oncheckboxchange="oncheckboxchange"></checkbox>
       </span>
     </li>
     <li v-show="isImmediately">
       每单满<input type="tel" :value="rule.min_shipping_fee | formatCurrency | noZeroCurrency"
       class="border-input" :class="{'active': rule.min_shipping_fee}" ref="minshippingfee"/>元，免配送费
     </li>
    </ul>
    <!-- <button @click="saveFee" class="modify-btn" type="button">保存</button> -->
    <button @click="saveFeeList" class="modify-btn" type="button">保存</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import checkbox from 'components/input/checkbox.vue'
  import utils from 'methods/util'
  export default {
    components: {checkbox},
    data () {
      return {
        distance: 0,
        minDistance: 0,
        maxDistance: 0,
        rule: {
          start_delivery_fee: 0,
          shipping_fee: 0,
          min_shipping_fee: 0,
          max_shipping_dist: 0
        },
        isImmediately: false,
        isModify: false
      }
    },
    mounted () {
      utils.setTitle('配送设置')
      let minDistance = this.$route.query.minDistance / 1000
      this.isImmediately = this.settings.min_shipping_fee !== 0
      this.minDistance = minDistance
      this.maxDistance = this.$route.query.maxDistance / 1000 || 99
      if (minDistance) {
        this.distance = minDistance
      }
      this.isModify = this.$route.query.action === 'modify'
      if (this.isModify) {
        let rule = window.sessionStorage.getItem('rule')
        this.rule = JSON.parse(rule)
        this.distance = this.rule.max_shipping_dist / 1000
      } else {

      }
    },
    computed: {
      settings () {
        return this.$store.getters.getSettings
      },
      limitDist () {
        return this.settings.dist_switch
      }
    },
    methods: {
      distanceBlur () {
        this.disabled = this.distance > this.maxDistance && this.distance < this.minDistance
      },
      addDistance () {
        if (this.distance === this.maxDistance - 0.5) {
          this.$toast('配送范围太大，配送员要跑断腿啦')
        }
        if (this.distance >= this.maxDistance) {
          this.distance = this.maxDistance
        } else {
          this.distance += 0.5
        }
      },
      reduceDistance () {
        if (this.distance === this.minDistance + 0.5) {
          this.$toast(`最小支持${this.minDistance}公里哟，不能再小啦`)
        }
        if (this.distance <= this.minDistance) {
          this.distance = this.minDistance
        } else {
          this.distance -= 0.5
        }
      },
      saveFee () {
        let startdeliveryfee = this.$refs.startfee.value * 100 || 0
        let shippingfee = this.$refs.shippingfee.value * 100 || 0
        let minshippingfee = this.$refs.minshippingfee.value * 100 || 0
        this.$http({
          url: `${config.oHost}diancan/mchnt/editsetting`,
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
      // 保存 或 编辑 阶段配送费
      saveFeeList (id) {
        let action = this.isModify ? 'modify' : 'add'
        let startdeliveryfee = this.$refs.startfee.value * 100 || 0
        let shippingfee = this.$refs.shippingfee.value * 100 || 0
        let minshippingfee = this.$refs.minshippingfee.value * 100 || 0
        this.rule = Object.assign(this.rule, {
          start_delivery_fee: startdeliveryfee,
          shipping_fee: shippingfee,
          min_shipping_fee: minshippingfee,
          max_shipping_dist: this.distance * 1000
        })
        let ruleStr = JSON.stringify(this.rule)
        this.$http({
          url: `${config.oHost}diancan/mchnt/editrules`,
          method: 'POST',
          params: {
            rule: ruleStr,
            action,
            rule_id: this.rule.rule_id,
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            if (this.isModify) {
              this.$store.commit('UPDATERULE', this.rule)
            } else {
              this.rule.rule_id = res.data.rule_id
              this.$store.commit('ADDRULE', this.rule)
            }
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
  @import "../../../styles/iconfont/iconfont.css";
  .container {
    padding-top: 24px;
    padding-bottom: 110px;
  }
  .dec, .add {
    height: 44px;
    width: 44px;
    font-size: 20px;
    border-radius: 6px;
    border: 2px solid #A7A9AE;
    background: #fff;
    vertical-align: middle;
  }
</style>
