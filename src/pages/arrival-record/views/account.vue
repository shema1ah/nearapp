<template lang="html">
  <div class="container">
    <div class="loading_box" v-if="hasdata">
      <div class="delay_container" v-if="amt">
        <div>
          <p>
            <span>收款</span>
            <span>(待入账)</span>
          </p>
          <p>
            <span>{{currentDate | splitDate}}</span>
            <span>周{{currentDate | format | formatWeekDay}}</span>
          </p>
        </div>
        <div>
          <span>+{{amt | formatCurrencyStr | formatCurrencyThree}}</span>
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
            <span :class="{'gathering' : item.action_type === 2 || item.action_type === 4}">{{item.amt | formatCurrencyStr | formatCurrencyThree}}</span>
            <span :class="{'arrow' : item.action_type !== 6 && item.action_type !== 4}"></span>
          </div>
        </li>
      </ul>
    </div>
    <div class="no_data" v-if="list.length === 0">
      <img v-if="isbaipai" src="../../../assets/no-data-baipai.png" alt="暂无数据">
      <img v-else src="../../../assets/no-data.png" alt="暂无数据">
      <p>暂无数据</p>
    </div>
    <loading :visible='isloading'></loading>
    <div class="no_more" v-if="nomore && list.length">
      没有更多了...
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
/* global _hmt */
import loading from 'components/loading/juhua.vue'
import util from 'methods/util'
import bridge from 'methods/bridge-v2'
import config from 'methods/config.js'
export default {
  data () {
    return {
      isloading: false,
      page: 1,
      amt: '',
      list: [],
      hasdata: false,
      nomore: 0,
      monthArr: [],
      currentDate: '',
      shopid: '',
      isbaipai: false
    }
  },
  components: {
    loading
  },
  created () {
    // this.shopid = util.getRequestQuerys().shopid || ''
    this.shopid = window.localStorage.getItem('shopid')
    this.isbaipai = util.isBaipaiApp()
    this.getCurrentDate()
    this.getMonth()
    this.requestlist()
  },
  computed: {

  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      util.setTitle('划款明细')
    })
  },
  mounted () {
    this.pageRefresh()
    window.addEventListener('scroll', this.loadmore, false)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.loadmore, false)
  },
  filters: {
    splitDate (item) {
      let date = item.substring(0, 10)
      return date.replace(/-/g, '/')
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
    // 调用原生的ios禁止下拉刷新功能
    pageRefresh () {
      bridge.pageRefresh({
        close: '1'
      })
    },
    viewdetail (actionType, bizSn) {
      switch (actionType) {
        case 2:
          _hmt.push(['_trackEvent', 'arrival-record', 'entry-account-item', 'click'])
          this.$router.push({name: 'entryDetail', params: {biz_sn: bizSn}, query: {shopid: this.shopid}})
          break
        case 3:
          _hmt.push(['_trackEvent', 'arrival-record', 'outer-account-item', 'click'])
          this.$router.push({name: 'outerDetail', params: {biz_sn: bizSn}})
          break
        case 4:
          break
        case 6:
          break
      }
    },
    loadmore () {
      let _this = this
      let windowScrollTop = window.scrollY
      let innerHeight = window.innerHeight
      let scrollHeight = document.body.scrollHeight
      if (windowScrollTop + innerHeight + 10 >= scrollHeight && !this.isloading) {
        if (this.nomore) {
          return
        }
        _this.page ++
        _this.requestlist()
      }
    },
    getCurrentDate () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      this.currentDate = year + '-' + month + '-' + day
    },
    getMonth () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      for (let i = 0; i < 3; i++) {
        if (month === 0) {
          month = 12
          year--
        }
        month = (month < 10 ? '0' + month : month)
        let requestMonth = year + '-' + month
        this.monthArr.push(requestMonth)
        month--
      }
    },
    requestlist () {
      this.isloading = true
      this.$http({
        url: `${config.oHost}fund/v1/account/record/`,
        method: 'GET',
        params: {
          page: this.page,
          month: this.monthArr[0],
          shopid: this.shopid || '',
          format: 'cors'
        }
      }).then(response => {
        this.isloading = false
        let res = response.data
        if (res.respcd === '0000') {
          this.hasdata = true
          this.amt = res.data.amt
          this.nomore = res.data.data.length || this.monthArr.length !== 1 ? 0 : 1
          if (!res.data.data.length && this.monthArr.length > 1) {
            this.monthArr.shift()
            this.page = 1
            this.requestlist()
          } else if (this.nomore) {
            return
          }
          this.list = this.list.concat(res.data.data)
          if (this.list.length < 20 && this.monthArr.length > 1) {
            this.monthArr.shift()
            this.page = 1
            this.requestlist()
          } else if (this.monthArr.length === 1 && res.data.data.length < 20) {
            this.page++
            this.requestlist()
          }
        } else {
          this.$toast(res.resperr)
        }
      }).catch(() => {
        this.isloading = false
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
  border-bottom: 3px solid #EFEFEF;
  border-top: 3px solid #EFEFEF;
  padding: 0 30px;
  div:first-of-type {
    padding: 30px 0;
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
      margin-top: 10px;
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
    border-bottom: 3px solid #EFEFEF;
    padding: 0 30px;
    div:first-of-type {
      padding: 30px 0;
      p:first-of-type span:first-of-type {
        font-size: 30px;
        color: #000;
      }
      p:last-of-type {
        color: #606470;
        font-size: 26px;
        margin-top: 10px;
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
.no_data {
  margin-top: 30vh;
  text-align: center;
  img {
    width: 340px;
  }
  p {
    font-size: 30px;
    margin-top: 50px;
    color: #8A8C92;
  }
}
</style>
