<template>
  <div class="container">
    <ul :class="{'has-bb':!isLimit}">
      <li>
        <em>配送范围限制</em>
        <span>
          <checkbox :value="isLimit"></checkbox>
        </span>
      </li>
      <li v-show="isLimit">
        <em>配送范围</em>
        <span>
          <button type="button" class="touch-btn" :disabled="distance <= 0.5 || distance > 99 ? 'disabled' : false" @click="reduceDistance"><i class="iconfont">&#xe601;</i></button>
          <input type="tel" @blur="distanceBlur" :class="{warn: (distance > 99)}" class="border-input" v-model="distance" number/>
          <button type="button" class="touch-btn" :disabled="distance >= 99 || distance < 0 ? 'disabled' : false" @click="addDistance"><i class="iconfont">&#xe600;</i></button>
          公里
        </span>
      </li>
    </ul>
    <map ref:map :location="switchLocation" :distance="distance" :visible="isLimit"></map>
    <button @click="saveScope" class="modify-btn" type="button">保存</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import store from '../vuex/store'
  import config from '../../../methods/config'
  import checkbox from '../../../components/input/checkbox.vue'
  import map from './mapImg.vue'
  export default {
    components: {checkbox, map},
    data () {
      return {
        isLimit: 0,
        longitude: 0,
        latitude: 0,
        distance: 0.5,
        disabled: false
      }
    },
    // route: {
    //   data (transition) {
    //     this.isLimit = parseFloat(transition.to.query.distance) !== 0
    //     this.longitude = transition.to.query.longitude
    //     this.latitude = transition.to.query.latitude
    //     this.distance = parseFloat(transition.to.query.distance) || 0.5
    //   }
    // },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.isLimit = parseFloat(vm.$route.query.distance) !== 0
        vm.longitude = vm.$route.query.longitude
        vm.latitude = vm.$route.query.latitude
        vm.distance = parseFloat(vm.$route.query.distance) || 0.5
      })
    },
    computed: {
      switchLocation () {
        return `${this.longitude},${this.latitude}`
      }
    },
    methods: {
      distanceBlur () {
        this.disabled = this.distance > 99 && this.distance < 0.5
      },
      addDistance () {
        if (this.distance === 98.5) {
          this.$toast('配送范围太大，配送员要跑断腿啦')
        }
        this.distance >= 99 ? this.distance = 99 : this.distance += 0.5
      },
      reduceDistance () {
        if (this.distance === 1) {
          this.$toast('最小支持0.5公里哟，不能再小啦')
        }
        this.distance <= 0.5 ? this.distance = 0.5 : this.distance -= 0.5
      },
      saveScope () {
        let maxShippingDist = this.isLimit ? this.distance * 1000 : 0
        this.$http({
          url: `${config.dcHost}diancan/mchnt/editsetting`,
          method: 'POST',
          data: {
            max_shipping_dist: maxShippingDist,
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            store.dispatch('UPDATEDIST', maxShippingDist)
            window.history.go(-1)
          } else {
            this.$toast(res.resperr)
          }
        })
      }
    },
    events: {
      'on-checkbox-change' (val) {
        this.isLimit = val
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
</style>
