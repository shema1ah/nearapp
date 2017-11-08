<template>
  <div class="container">
    <div class="item no-arrow">
      <em>配送范围限制</em>
      <span>
        <i :class="{'red': !settings.dist_switch, 'green': settings.dist_switch}">{{stateText}}</i>
        <checkbox :value="limitDist" @oncheckboxchange="switchDist"></checkbox>
      </span>
    </div>
    <div class="item" @click="setDeliveryFee()" v-show="!limitDist">
      <em>配送费设置</em>
      <span v-if="settings.start_delivery_fee || settings.shipping_fee || settings.min_shipping_fee">
        <span v-if="!settings.dist_switch" style="display:block">不限制配送范围</span>
        <span v-if="settings.start_delivery_fee"><i>{{settings.start_delivery_fee | formatCurrency | noZeroCurrency}}</i>元起送<span v-if="settings.shipping_fee">，</span></span>
        <span v-if="settings.shipping_fee">配送费<i>{{settings.shipping_fee | formatCurrency | noZeroCurrency}}</i>元/单<br/></span>
        <span style="display:block" v-if="settings.min_shipping_fee">每单满<i>{{settings.min_shipping_fee | formatCurrency | noZeroCurrency}}</i>元，免配送费</span>
      </span>
      <span v-else>免配送费</span>
    </div>
    <div v-show="limitDist">
      <ul class="deliveryscope_list">
        <li v-for="(rule, index) in rules" @click="modifyRule(rule)">
          <div class="left" :class="index | formatnumber"></div>
          <div class="right">
            <div class="item no-arrow scopelimit common">
              <em>配送范围：{{min_shipping_dist(index) | formatDistance}}-{{rule.max_shipping_dist | formatDistance}}公里</em>
              <span>
                <button @click.stop="deleteRule(index, rule.rule_id)">删除</button>
              </span>
            </div>
            <div class="item no-arrow common initiation_delivery">
              <em>起送价格：{{rule.start_delivery_fee | formatCurrency | noZeroCurrency}}元</em>
            </div>
            <div class="item no-arrow common price">
              <em>配送费：{{rule.shipping_fee | formatCurrency | noZeroCurrency}}元</em>
              <span>
                每单满{{rule.min_shipping_fee | formatCurrency | noZeroCurrency}}元，免配送费
              </span>
            </div>
          </div>
        </li>
      </ul>
      <p class="tips"><span>*</span> 最多可设置五个配送范围</p>
      <button class="default-button add-btn" @click="addscope()"><i class="iconfont">&#xe600;</i>添加范围</button>
    </div>
  </div>
</template>

<script>
import config from 'methods/config'
import checkbox from 'components/input/checkbox.vue'

export default {
  data () {
    return {
      limitDist: 0,
      rules: []
    }
  },
  filters: {
    formatnumber (num) {
      return ['one', 'two', 'three', 'four', 'five'][num]
    }
  },
  components: {checkbox},
  computed: {
    settings () {
      return this.$store.getters.getSettings
    },
    stateText () {
      return this.limitDist ? '已开启' : '已关闭'
    }
  },
  created () {
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
      // this.$store.commit('UPDATELIMITSCOPE', this.value)
    },
    setDeliveryFee () {
      this.$router.push({
        name: 'fee'
      })
    },
    deleteRule (index, id) {
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
          // this.rules
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
.deliveryscope_list {
  margin-top: 18px;
  li {
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
    margin-bottom: 20px;
    display: flex;
    .left {
      width: 10px;
    }
    .right {
      flex: 1;
    }
  }
}
.item button {
    font-size: 24px;
    color: #A7A9AE;
  }
.common {
  border: none;
  margin-top: 0;
}
.scopelimit {
  padding-top: 28px;
  padding-bottom: 30px;
}
.initiation_delivery {
  padding-bottom: 16px;
  padding-top: 0;
  font-size: 26px;
  color: #8A8C92;
}
.price {
  padding-top: 0;
  font-size: 26px;
  color: #8A8C92;
  justify-content: space-between;
  span {
    flex: none;
    color: #FF8100;
    border: 2px solid #FF8100;
    border-radius: 6px;
    padding: 4px 12px;
  }
}
.tips {
  font-size: 24px;
  color: #A7A9AE;
  margin: 0 0 112px 20px;
  span {
    color: #FF8100;
  }
}
.one {
  background: #FFE18A;
}
.two {
  background: #FFBA46;
}
.three {
  background: #FF9C11;
}
.four {
  background: #D7770F;
}
.five {
  background: #C05100;
}
</style>
