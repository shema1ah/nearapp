<template lang="html">
  <div class="content">
    <div class="btn-writeoff-list-view">
      <ul class="btn-writeoff-list">
        <li v-for="item in dayData">
          <p class="item-title">
            <span>{{ item[0].update_time | splitDate }}</span>
            <span>周{{ item[0].update_time | format | formatWeekDay }}</span>
          </p>
          <ul class="inner-data">
            <li v-for="data in item">
              <div class="data-title flex alignS itemC">
                <p class="goods_name">{{ data.goods_name }}</p>
                <p class="create_time">{{ data.create_time.substring(10)}}</p>
              </div>
              <div class="ticket-code">
                <p><span>券码 </span>{{ data.ticket_code }}</p>
              </div>
              <div class="order-info flex alignC">
                <div class="order-info-item flex alignC">
                  <p>订单金额</p>
                  <p><span>{{ data.current_price | formatCurrency}}</span>&nbsp;<span>元</span></p>
                </div>
                <div class="order-info-item flex alignC">
                  <p>商家实收</p>
                  <p><span>{{ data.receipt_amt | formatCurrency}}</span>&nbsp;<span>元</span></p>
                </div>
                <div class="order-info-item flex alignC">
                  <p>商家优惠</p>
                  <p><span>{{ data.discount_amt | formatCurrency}}</span>&nbsp;<span>元</span></p>
                </div>
                <div class="order-info-item flex alignC">
                  <p>平台优惠</p>
                  <p><span>{{ data.koubei_subsidy_amt | formatCurrency}}</span>&nbsp;<span>元</span></p>
                </div>
              </div>
              <div class="bottom-line"></div>
            </li>
          </ul>
        </li>
      </ul>
      <div class="more-btn" v-show='loaded'>
        <p>没有更多了~</p>
      </div>
    </div>
    <div v-if="nodata" class="no-data">暂无核销数据</div>
    <loading :visible="loading"></loading>
    <div class="btn-writeoff" @click="getCode">扫码核券</div>
  </div>
</template>

<script>
import bridge from 'methods/bridge-v2'
import util from 'methods/util'
import config from 'methods/config'
import loading from 'components/loading/juhua.vue'

export default {
  data () {
    return {
      nodata: false,
      currentPage: 1,
      loading: false,
      loaded: false,
      dayData: []
    }
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
    },
    formatWeekDay (weekday) {
      if (isNaN(weekday)) return
      return ['日', '一', '二', '三', '四', '五', '六'][weekday]
    },
    formatCurrency (number) {
      if (isNaN(number)) return
      number = Number((number / 100).toFixed(2))
      return number
    }
  },
  components: {
    loading: loading
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      util.setTitle('核销明细')
    })
  },
  mounted () {
    let _this = this
    window.onscroll = () => {
      var scrollHeight = document.body.scrollHeight
      var windowScrollTop = window.scrollY
      var innerHeight = window.innerHeight
      if (windowScrollTop + innerHeight >= (scrollHeight / 2)) {
        if (!this.loaded) {
          _this.getWriteoffList()

        }
      }
    }
  },
  created () {
    this.getAuthoriza()
  },
  methods: {
    getAuthoriza () {
      let baseurl = config.shHost
      this.$http({
        url: config.shHost + 'merchant/koubei/is_auth',
        method: 'GET',
        params: {
          format: 'cors'
        }
      }).then((res) => {
        let data = res.data
        if (data.respcd === config.code.OK) {
          if (data.data.is_auth) { // 已经授权成功了
            this.getWriteoffList()
          } else {
            this.$toast({
              message: '本店尚未开通此功能',
              duration: 3000
            })
            setTimeout(() => {
              bridge.close({
                type: '1'
              })
            }, 3000)
          }
        } else {
          this.$toast(data.respmsg)
          setTimeout(() => {
            bridge.close({
              type: '1'
            })
          }, 3000)
        }
      })
    },
    getWriteoffList () {
      this.loading = true
      let data = {
        offset: this.currentPage,
        limit: 5,
        charset: 'utf-8',
        format: 'cors'
      }
      let baseurl = config.shHost
      // let baseurl = 'http://172.100.113.124:9092/'
      this.$http({
        url: baseurl + 'merchant/koubei/ticket/record',
        method: 'GET',
        params: data
      }).then((res) => {
        this.loading = false
        let data = res.data
        if (data.respcd === config.code.OK && data.data.records.length > 0) {
          this.splitData(data.data.records)
          this.currentPage++
        } else if (data.respcd === config.code.OK && data.data.records.length === 0 && this.currentPage !== 1) {
          this.loaded = true
        } else if (data.respcd === config.code.OK && data.data.records.length === 0 && this.currentPage === 1) {
          this.nodata = true
        } else {
          this.$toast(data.respmsg)
        }
      }).catch(() => {
        this.$toast('网络错误，请重试')
      })
    },
    getCode () {
      let _this = this
      bridge.scanQrcode({}, function (res) {
        if(res.ret === 'OK') {
          _this.$router.replace({name: 'infoconfirm', params: {qrcode: res.qrcode}})
        } else {
          alert(res.ret)
        }
      })
    },
    splitData (data) {
      let preDataTime
      for (let i in data) {
        preDataTime = this.dayData.length > 0 ? this.dayData[this.dayData.length - 1][0].create_time.substring(0, 10) : ''
        if (preDataTime && data[i].create_time.substring(0, 10) === preDataTime) {
          this.dayData[this.dayData.length - 1].push(data[i])
        } else {
          let newArr = []
          newArr.push(data[i])
          this.dayData.push(newArr)
        }
      }
    }
  }
}
</script>

<style lang="scss" type="scss" scoped>
div,ul,li {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.flex {
  display: flex;
}
.alignS {
  justify-content: space-between;
}
.alignA {
  justify-content: space-around;
}
.alignC {
  justify-content: center;
}
.itemC {
  align-items: center;
}
.content {
  width: 100%;
  height: 100vh;
  background-color: #F7F7F7;
  -webkit-font-smoothing: antialiased;
  padding-top: 20px;
}
.no-data {
  width: 100%;
  text-align: center;
  line-height: 80px;
  font-size: 30px;
}
.btn-writeoff-list-view {
  padding-bottom: 100px;
  width: 100%;
  .btn-writeoff-list {
    width: 100%;
    background-color: #F7F7F7;
    li {
      background-color: #fff;
      margin-bottom: 20px;
    }
    .item-title {
      width: 100%;
      height: 90px;
      line-height: 90px;
      padding-left: 30px;
      font-size: 30px;
      color: #8A8C92;
      border-bottom: 2px dashed #E5E5E5;
      border-top: 1px solid #E5E5E5;
    }
  }
}
.inner-data {
  width: 100%;
  padding: 30px 0 0;
  li {
    width: 100%;
    padding-bottom: 30px;
    .bottom-line {
      margin: 0 30px;
      border-bottom: 1px solid #E5E5E5;
      transform: translateY(30px);
    }
  }
  li:last-child {
    .bottom-line {
      border-bottom: none;
    }
  }
  .data-title {
    padding: 0 30px;
  }
  .goods_name {
    font-size: 32px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
  }
  .create_time {
    font-size: 26px;
    color: #8A8C92;
  }
  .ticket-code {
    font-size: 30px;
    color: #606470;
    padding: 20px 30px;
    span {
      color: #8A8C92;
    }
  }
  .order-info {
    width: 100%;
    padding-top: 4px;
    .order-info-item {
      flex-wrap: wrap;
      border-right: 2px solid #E5E5E5;
      width: 25%;
      p {
        width: 100%;
        text-align: center;
        font-size: 24px;
      }
      p:first-child {
        color: #8A8C92;
      }
      p:last-child {
        padding-top: 8px;
        color: #000;
        span:first-child {
          display: inline-block;
          height: 35px;
          font-size: 30px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          line-height: 50px;
        }
        span:last-child {
          display: inline-block;
          transform: translateY(-2px);
        }
      }
    }
    .order-info-item:last-child {
      border-right: none;
    }
  }
}
.btn-writeoff {
  font-size: 34px;
  height: 88px;
  width: 100%;
  text-align: center;
  line-height: 88px;
  color: #fff;
  background-color: #FF8100;
  position: fixed;
  bottom: 0;
}
.more-btn {
  color: #8A8C92;
  font-size: 30px;
  background-color: #fff;
  text-align: center;
  padding: 0 0 24px 0;
  p {
    margin: 0;
  }
}
</style>
