<template>
  <div class="container">
    <div class="item no-arrow">
      <em>自动接单</em>
      <span>
        <i :class="{'red' : !state , 'green' : state}">{{stateText}}</i>
        <checkbox :value='settings.auto_order_switch' @oncheckboxchange="oncheckboxchange"></checkbox>
      </span>
    </div>
    <ul class="tips">
      <li>
        <h3><span>*</span>接单</h3>
        <p>
          1. 请保持打印机正常链接，并保持店铺联系电话通畅
          打印机打印小票正常，新订单才会被自动接下
          否则，会打电话通知店铺新订单，仍需手动接单。
        </p>
      </li>
      <li>
        <h3><span>*</span>配送</h3>
        <p>2. 下订单后15分钟，自动修改订单状态为“配送中”。</p>
      </li>
      <li>
        <h3><span>*</span>完成</h3>
        <p>3. 下订单后3个小时，自动修改订单状态为“已完成”。</p>
      </li>
    </ul>
  </div>
</template>

<script>
import config from 'methods/config'
import checkbox from 'components/input/checkbox.vue'
import utils from 'methods/util'
export default {
  data () {
    return {
      state: '',
      stateText: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      utils.setTitle('自动接单')
    })
  },
  computed: {
    settings () {
      return this.$store.getters.getSettings
    }
  },
  mounted () {
    this.state = this.settings.auto_order_switch
    this.stateText = this.settings.auto_order_switch ? '已开启' : '已关闭'
  },
  components: {
    checkbox
  },
  methods: {
    oncheckboxchange (val) {
      this.state = val
      this.stateText = val ? '已开启' : '已关闭'
      this.$http({
        url: `${config.oHost}diancan/mchnt/auto_order`,
        method: 'POST',
        params: {
          mchnt_id: this.settings.userid,
          type: 'switch',
          auto_order: val,
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          this.$store.commit('UPDATEAUTOORDER', val)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
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
  .tips {
    background-color: #f7f7f7;
    padding: 0 42px 0 42px;
    margin-top: 42px;
    li {
      display: block;
      border: none;
      margin-bottom: 42px;
      h3 {
        font-size: 28px;
        color: #606470;
        font-weight: normal;
        span {
          font-size: 28px;
          color: #FF8100;
          margin-right: 8px;
        }
      }
      p {
        font-size: 28px;
        color: #8A8C92;
        // text-indent: 1em;
        padding-left: 1em;
      }
    }
  }
</style>
