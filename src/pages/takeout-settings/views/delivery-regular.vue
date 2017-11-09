<template>
  <div class="container">
    <div class="item no-arrow">
      <em>配送范围限制</em>
      <span>
        <i :class="{'red': !settings.dist_switch, 'green': settings.dist_switch}">{{stateText}}</i>
        <checkbox :value="limitDist" @oncheckboxchange="switchDist"></checkbox>
      </span>
    </div>
    <div class="item multi-line" @click="setDeliveryFee()" v-show="!limitDist">
      <em>配送费设置</em>
      <span v-if="rule.start_delivery_fee || rule.shipping_fee || rule.min_shipping_fee">
        <span v-if="!rule.dist_switch" style="display:block">不限制配送范围</span>
        <span v-if="rule.start_delivery_fee"><i>{{rule.start_delivery_fee | formatCurrency}}</i>元起送<span v-if="rule.shipping_fee">，</span></span>
        <span v-if="rule.shipping_fee">配送费<i>{{rule.shipping_fee | formatCurrency}}</i>元/单<br/></span>
        <span style="display:block" v-if="rule.min_shipping_fee">每单满<i>{{rule.min_shipping_fee | formatCurrency}}</i>元，免配送费</span>
      </span>
      <span v-else>免配送费</span>
    </div>
    <div v-show="limitDist">
      <ul class="delivery-scope-list">
        <li v-for="(rule, index) in rules" @click="modifyRule(rule)">
          <h3>
            <span>配送范围：{{min_shipping_dist(index) | formatDistance}}-{{rule.max_shipping_dist | formatDistance}}公里</span>
            <button @click.stop="deleteRule(index, rule.rule_id)">删除</button>
          </h3>
          <p>起送价格：{{rule.start_delivery_fee | formatCurrency}}元</p>
          <p>配送费：{{rule.shipping_fee | formatCurrency}}元</p>
          <span v-show="rule.min_shipping_fee" class="free">每单满{{rule.min_shipping_fee | formatCurrency}}元，免配送费</span>
        </li>
      </ul>
      <p class="tip"><i>*</i> 最多可设置10个配送范围</p>
      <button class="default-button add-btn" @click="addscope()"><i class="iconfont">&#xe600;</i>添加范围</button>
    </div>
  </div>
</template>

<script>
import config from 'methods/config'
import checkbox from 'components/input/checkbox.vue'
import utils from 'methods/util'
export default {
  data () {
    return {
      limitDist: 0,
      rules: []
    }
  },
  components: {checkbox},
  computed: {
    settings () {
      return this.$store.getters.getSettings
    },
    stateText () {
      return this.limitDist ? '已开启' : '已关闭'
    },
    // 不限制配送范围时候，使用第一条配送规则
    rule () {
      if (!utils.isEmptyObject(this.settings)) {
        return this.settings.rules[0]
      } else {
        return {
          start_delivery_fee: 0
        }
      }
    }
  },
  created () {
    utils.setTitle('配送规则')
    this.limitDist = this.settings.dist_switch
    this.rules = this.settings.rules
  },
  methods: {
    min_shipping_dist (index) {
      if (index === 0) {
        return 0
      }
      let preIndex = index - 1
      preIndex = preIndex >= 0 ? preIndex : 0
      return this.rules[preIndex].max_shipping_dist
    },
    switchDist (value) {
      this.$http({
        url: `${config.oHost}diancan/mchnt/editsetting`,
        method: 'POST',
        params: {
          dist_switch: value,
          format: 'cors'
        }
      }).then((response) => {
        let res = response.data
        if (res.respcd === '0000') {
          this.$store.commit('UPDATELIMITSCOPE', value)
          this.limitDist = value
        } else {
          this.$toast(res.resperr)
        }
      })
    },
    addscope () {
      let arrayIndex = this.rules.length - 1
      let preDistance = this.rules[arrayIndex].max_shipping_dist + 500
      this.$router.push({
        name: 'fee',
        query: {
          minDistance: preDistance
        }
      })
    },
    setDeliveryFee () {
      window.sessionStorage.setItem('rule', JSON.stringify(this.rule))
      this.$router.push({
        name: 'fee',
        query: {
          action: 'modify'
        }
      })
    },
    deleteRule (index, id) {
      if (this.rules.length === 1) {
        this.$toast('最少要有一个配送范围')
        return false
      }
      this.$http({
        url: `${config.oHost}diancan/mchnt/editrules`,
        method: 'POST',
        params: {
          rule_id: id,
          action: 'delete',
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          this.rules.splice(index, 1)
        } else {
          this.$toast(res.resperr)
        }
      })
    },
    modifyRule (rule) {
      window.sessionStorage.setItem('rule', JSON.stringify(rule))
      this.$router.push({
        name: 'fee',
        query: {
          action: 'modify'
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../styles/iconfont/iconfont.css";
.add-btn {
  width: 100%;
  height: 88px;
  font-size: 32px;
  position: fixed;
  bottom: 0;
  left: 0;
  i {
    font-size: 32px;
  }
}
.delivery-scope-list {
  li {
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    padding-left: 30px;
    padding-bottom: 20px;
    &:before {
      content: "";
      width: 10px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    &:nth-child(1):before{
      background-color: #FFF91A;
    }
    &:nth-child(2):before{
      background-color: #FFDC21;
    }
    &:nth-child(3):before{
      background-color: #FFB916;
    }
    &:nth-child(4):before{
      background-color: #FF9500;
    }
    &:nth-child(5):before{
      background-color: #FF7B00;
    }
    &:nth-child(6):before{
      background-color: #F85503;
    }
    &:nth-child(7):before{
      background-color: #D93400;
    }
    &:nth-child(8):before{
      background-color: #AE2A00;
    }
    &:nth-child(9):before{
      background-color: #860000;
    }
    &:nth-child(10):before{
      background-color: #6B0000;
    }
  }
  h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #2F323A;
    font-size: 30px;
    font-weight: normal;
    span, button {
      display: block;
    }
    button {
      outline: none;
      cursor: pointer;
      font-size: 24px;
      color: #A7A9AE;
      width: 100px;
      height: 80px;
    }
  }
  p {
    font-size: 26px;
    color: #A7A9AE;
    line-height: 1.5;
  }
  .free {
    color: #FF8100;
    border: 2px solid #FF8100;
    border-radius: 6px;
    padding: 4px 12px;
    position: absolute;
    right: 28px;
    bottom: 24px;
  }
}
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
