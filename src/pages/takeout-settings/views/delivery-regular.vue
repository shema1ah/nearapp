<template>
  <div class="container">
    <div class="item no-arrow">
      <em>配送范围限制</em>
      <span>
        <i :class="{'red': !value, 'green': value}">{{stateText}}</i>
        <checkbox @oncheckboxchange="oncheckboxchange"></checkbox>
      </span>
    </div>
    <div class="item" @click="setFee()">
      <em>配送费设置</em>
      <span>
        20元起送，配送费5元/单<br/>
        每单满68元,免配送费
      </span>
    </div>
    <ul class="deliveryscope_list" v-if="value">
      <li v-for="(item, index) in datalist">
        <div class="left" :class="index | formatnumber"></div>
        <div class="right">
          <div class="item no-arrow scopelimit common">
            <em>配送范围：0-2公里</em>
            <span>
              <button>删除</button>
            </span>
          </div>
          <div class="item no-arrow common initiation_delivery">
            <em>起送价格：25元</em>
          </div>
          <div class="item no-arrow common price">
            <em>配送费：8元</em>
            <span>
              每单满99元，免配送费
            </span>
          </div>
        </div>
      </li>
    </ul>
    <p v-if="value" class="tips"><span>*</span> 最多可设置五个配送范围</p>
    <button class="default-button addbtn" :class="{'close': !value}" :disabled="!value" @click="addscope()">+添加范围</button>
  </div>
</template>

<script>
import checkbox from 'components/input/checkbox.vue'

export default {
  data () {
    return {
      value: '',
      stateText: '已关闭',
      datalist: [
        1, 2, 3, 4, 5
      ]
    }
  },
  filters: {
    formatnumber (num) {
      return ['one', 'two', 'three', 'four', 'five'][num]
    }
  },
  components: {checkbox},
  methods: {
    oncheckboxchange (val) {
      this.value = val
      this.stateText = val ? '已开启' : '已关闭'
    },
    addscope () {
      this.$router.push({name: 'fee'})
      this.$store.commit('UPDATELIMITSCOPE', this.value)
    },
    setFee () {
      this.$router.push({name: 'fee'})
    }
  }
}
</script>

<style lang="scss">
.addbtn {
  width: 100%;
  height: 88px;
  font-size: 32px;
  position: fixed;
  bottom: 0;
  left: 0;
}
.close {
  background-color: #D8D8D8;
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
