<template>
  <div class="container">
    <ul class="has-bb list">
      <li v-if="limitDist">
        <em>配送范围</em>
        <span>
          <button type="button" class="touch-btn" :disabled="distance <= minDistance || distance > maxDistance ? 'disabled' : false" @click="reduceDistance"><i class="iconfont">&#xe601;</i></button>
          <input type="number" @blur="distanceBlur" :class="{warn: isWarn}" class="border-input active-input" v-model="distance" debounce="3000"/>
          <button type="button" class="touch-btn" :disabled="distance >= maxDistance || distance < minDistance ? 'disabled' : false" @click="addDistance"><i class="iconfont">&#xe600;</i></button>
          公里
        </span>
      </li>
     <li>
       <em>起送价</em>
       <span>
         <input type="number" class="tel-input" placeholder="请输入金额" v-model="start_delivery_fee_format"/> 元
       </span>
     </li>
     <li>
       <em>配送费</em>
       <span>
         <input type="number" class="tel-input" placeholder="请输入金额" v-model="shipping_fee_format"/> 元
       </span>
     </li>
     <li>
       <em>满减免配送费</em>
       <span>
         <checkbox :value="isMoneyOff" @oncheckboxchange="oncheckboxchange"></checkbox>
       </span>
     </li>
     <li v-show="isMoneyOff">
       <span>每单满<input type="number" v-model="min_shipping_fee_format" class="border-input active-input"/>元，免配送费</span>
     </li>
    </ul>
    <button @click="saveFeeList()" class="modify-btn" type="button">保存</button>
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
        distance: 0.5,
        minDistance: 0,
        maxDistance: 0,
        rule: {
          start_delivery_fee: 0,
          shipping_fee: 0,
          min_shipping_fee: 0,
          max_shipping_dist: 0
        },
        isMoneyOff: false, // 是否 满减
        isModify: false,
        isWarn: false   // 大于最大配送范围或小于最小配送范围
      }
    },
    mounted () {
      utils.setTitle('配送设置')
      let minDistance = this.$route.query.minDistance / 1000
      this.minDistance = minDistance || 0.5
      let maxDistance = this.$route.query.maxDistance / 1000
      this.maxDistance = maxDistance || 99
      if (minDistance) {
        this.distance = minDistance
      }
      this.isModify = this.$route.query.action === 'modify'
      if (this.isModify) {
        let rule = JSON.parse(window.sessionStorage.getItem('rule'))
        this.rule = rule
        this.isMoneyOff = rule.min_shipping_fee !== 0
        this.distance = rule.max_shipping_dist / 1000
      }
    },
    computed: {
      settings () {
        return this.$store.getters.getSettings
      },
      limitDist () {
        return this.settings.dist_switch
      },
      start_delivery_fee_format: {
        get: function () {
          return this.rule.start_delivery_fee / 100 || ''
        },
        set: function (value) {
          this.rule.start_delivery_fee = value * 100 || ''
        }
      },
      shipping_fee_format: {
        get: function () {
          return this.rule.shipping_fee / 100 || ''
        },
        set: function (value) {
          this.rule.shipping_fee = value * 100 || ''
        }
      },
      min_shipping_fee_format: {
        get: function () {
          return this.rule.min_shipping_fee / 100 || ''
        },
        set: function (value) {
          this.rule.min_shipping_fee = value * 100 || ''
        }
      }
    },
    methods: {
      distanceBlur () {
        this.isWarn = this.distance < this.minDistance || this.distance > this.maxDistance
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
      // 保存 或 编辑 阶段配送费
      saveFeeList (id) {
        if (this.isWarn) {
          this.$toast('配送范围设置不合理')
          return false
        }
        let action = this.isModify ? 'modify' : 'add'
        let startdeliveryfee = this.start_delivery_fee_format * 100 || 0
        let shippingfee = this.shipping_fee_format * 100 || 0
        let minshippingfee = this.isMoneyOff ? this.min_shipping_fee_format * 100 || 0 : 0
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
        this.isMoneyOff = val
      }
    }
  }
</script>

<style scoped lang="scss" type="scss" rel="stylesheet/scss">
@import "../../../styles/iconfont/iconfont.css";
.container {
  padding-top: 24px;
}
.list {
  margin-top: 0;
  margin-bottom: 0;
  background-color: #fff;
  font-size: 30px;
  color: #2F323A;
  padding-left: 30px;
  border-top: 2px solid #E5E5E5;
  li {
    min-height: 90px;
    border-top: 2px solid #E5E5E5;
    padding-right: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:first-child{
      border-top: none;
    }
    em, span {
      display: block;
    }
    em {
      font-style: normal;
    }
    span {
      text-align: right;
    }
  }
}
.active-input:focus {
  border-color: #ff8100;
}
</style>
