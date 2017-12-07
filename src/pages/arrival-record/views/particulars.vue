<template lang="html">
  <div class="container" v-if="hasdata">
    <div class="delay_container">
      <div>
        <p>
          <span>收款</span>
          <span>(待入账)</span>
        </p>
        <p>
          <!-- <span></span>
          <span>周</span> -->
        </p>
      </div>
      <div>
        <span>+{{amt}}</span>
        <span></span>
      </div>
    </div>
    <ul class="particulars_list">
      <li @click="viewdetail(item.action_type, item.biz_sn)" v-for="item in list">
        <div>
          <p>
            <span>{{action_type(item.action_type)}}</span>
          </p>
          <p>
            <span>{{item.ctime | splitDate}}</span>
            <span>周{{item.ctime | format | formatWeekDay}}</span>
          </p>
        </div>
        <div>
          <span class="gathering" v-if="item.action_type === 2 || item.action_type === 4">+</span>
          <span :class="{'gathering' : item.action_type === 2 || item.action_type === 4}">{{item.amt}}</span>
          <span :class="{'arrow' : item.action_type !== 6 && item.action_type !== 4}"></span>
        </div>
      </li>
    </ul>
    <loading :visible='loading'></loading>
  </div>
</template>

<script>
import loading from '../../../components/loading/juhua.vue'
export default {
  data () {
    return {
      loading: false,
      page: 1,
      amt: '',
      list: [],
      hasdata: false,
      nomore: 0
    }
  },
  components: {
    loading
  },
  created () {
    this.loading = true
    this.requestlist()
  },
  computed: {

  },
  mounted () {
    let _this = this
    window.onscroll = () => {
      if (this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight()) {
        if (this.nomore) {
          this.$toast('没有更多了。。。')
          return
        }
        _this.page ++
        _this.requestlist()
      }
    }
  },
  filters: {
    splitDate (item) {
      return item.substring(0, 10)
    },
    format (item) {
      let date = item.substring(0, 10)
      let arr = []
      let sdate
      arr = date.split('-')
      sdate = new Date(arr[0], parseInt(arr[1] - 1), arr[2])
      return sdate.getDay()
    }
  },
  methods: {
    viewdetail (actionType, bizSn) {
      switch (actionType) {
        case 2:
          this.$router.push({name: 'paymentDetails', params: {biz_sn: bizSn}})
          break
        case 3:
          this.$router.push({name: 'detail', params: {biz_sn: bizSn}})
          break
        case 4:
          break
        case 6:
          break
      }
    },
    requestlist () {
      this.$http({
        url: 'http://172.100.107.244:7200/account/record/',
        method: 'GET',
        params: {
          page: this.page,
          month: '2017-12',
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          this.loading = false
          this.hasdata = true
          this.amt = res.data.amt
          this.nomore = res.data.data.length ? 0 : 1
          this.list = this.list.concat(res.data.data)
          console.log(this.list)
        } else {
          this.$toast(res.resperr)
        }
      })
    },
    action_type (actionType) {
      switch (actionType) {
        case 2 :
          return '收款'
        case 3 :
          return '自动划款'
        case 4 :
          return '划款失败回款'
        case 6 :
          return '扣款'
      }
    }
  }
}
</script>

<style lang="scss" type="scss">
@import "../../../styles/global.scss";
body {
  background: #F7F7F7;
}
.delay_container {
  height: 132px;
  background: #fff;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E5E5E5;
  padding: 0 30px;
  div:first-of-type {
    p:first-of-type span:first-of-type {
      font-size: 30px;
      color: #000;
    }
    p:first-of-type span:last-of-type {
      color: #FF8100;
      font-size: 26px;
    }
    p:last-of-type {
      color: #606470;
      font-size: 26px;
      margin-top: 20px;
    }
  }
  div:last-of-type {
    span:first-of-type {
      font-size: 32px;
      color: #FF8100;
      vertical-align: middle;
    }
  }
}
.particulars_list {
  background: #fff;
  li {
    height: 132px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #E5E5E5;
    padding: 0 30px;
    div:first-of-type {
      p:first-of-type span:first-of-type {
        font-size: 30px;
        color: #000;
      }
      p:last-of-type {
        color: #606470;
        font-size: 26px;
        margin-top: 20px;
      }
    }
    div:last-of-type {
      display: flex;
      align-items: center;
      span {
        font-size: 32px;
        vertical-align: middle;
      }
    }
  }
}
.gathering {
  color: #FF8100;
}
.arrow {
  display: inline-block;
  width: 16px;
  height: 32px;
  background: url('../assets/arrow.png') no-repeat;
  background-size: 100% 100%;
  margin-left: 16px;
  vertical-align: middle;
}
</style>
