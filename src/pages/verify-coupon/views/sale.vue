<template lang="html">
  <div class="wrapper">
    <header>
      <form class="">
        <input type="text" placeholder="输入兑换码" v-model="code"><button @click="verifyCode()" :disabled="isPending" type="button">兑换</button>
      </form>
      <button type="button" @click="scanQrcode" class="scan-btn"><img src="../assets/scan.svg" alt="扫码二维码"></button>
    </header>
    <dl class="coupons" v-for="(item, index) in coupons">
      <dt v-show="index === 0 ? true : item.date !== coupons[index - 1].date" :class="{'mt0': index === 0}">
        <strong>{{item.date | formatSlashDate}} 星期{{item.date | weekday}}</strong>
        <span>共<em>{{item.total_num}}</em>次</span>
      </dt>
      <dd v-for="record in item.records">
        <img :src="record.goods_pic" alt="特卖商品图标">
        <div>
          <h3>{{record.name}}</h3>
          <p class="code">兑换码 <em>{{record.code}}</em></p>
          <p class="footer"><time>{{record.redeem_time | splitDate}}</time><span>x {{record.goods_cnt}}</span></p>
        </div>
        <button v-if="isSupportPrint" type="button" class="secondary-button" @click="printTicket(record.code)">打印</button>
      </dd>
    </dl>
    <infinite-loading @infinite="getCoupons" spinner="spiral">
      <span slot="no-more"></span>
      <span slot="no-results"><img src="../../../assets/no-data.png" alt="暂无核销数据"><p>暂无核销数据</p></span>
    </infinite-loading>
  </div>
</template>

<script type="text/ecmascript-6">
import config from 'methods/config'
import bridge from 'methods/bridge-v2'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    InfiniteLoading
  },
  data () {
    return {
      isPending: false,
      coupons: [],
      page: 0,
      code: '', // 兑换码
      isSupportPrint: false
    }
  },
  created () {
    this.isSupportPrint = this.isAndroid()
  },
  filters: {
    formatSlashDate (date) {
      return date.replace(/-/g, '/')
    },
    splitDate (date) {
      return date.split(/\s/)[1]
    },
    weekday (date) {
      let weekday = new Date(date).getDay()
      return ['日', '一', '二', '三', '四', '五', '六'][weekday]
    }
  },
  methods: {
    getCoupons ($state) {
      this.$http({
        url: `${config.oHost}mchnt/special/verify_list`,
        method: 'GET',
        params: {
          format: 'cors',
          page: this.page,
          pagesize: 10
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          let records = res.data.records
          this.coupons = this.coupons.concat(records)
          if (records.length === 0) {
            $state.complete()
            return false
          }
          $state.loaded()
          this.page ++
          let totalCount = 0
          for (let i = 0; i < records.length; i++) {
            totalCount += records[i].total_num
          }
          if (totalCount < 10) {
            $state.complete()
          }
        } else {
          this.$toast(res.resperr)
          $state.complete()
        }
      })
    },
    scanQrcode () {
      let _this = this
      bridge.scanQrcode({}, function (res) {
        if (res.qrcode) {
          _this.verifyCode(res.qrcode)
        }
      })
    },
    formatCurrency(number) {
      if (isNaN(number)) return
      number = (number / 100).toFixed(2)
      return number
    },
    isAndroid() {
      let ua = navigator.userAgent
      return ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1
    },
    verifyCode (code = this.code) {
      if (!code) {
        this.$toast('兑换码不能为空')
        return false
      }
      this.isPending = true
      this.$Indicator.open('请稍后...')
      this.$http({
        url: `${config.oHost}mchnt/special/verify`,
        method: 'POST',
        params: {
          format: 'cors',
          code
        }
      }).then(response => {
        this.$Indicator.close()
        this.isPending = false
        let res = response.data
        if (res.respcd === '0000') {
          if (this.isAndroid()) {
            let data = response.data.data
            let orderAmt = '￥' + this.formatCurrency(data.pay_amt)
            let origamtAmt = '￥' + this.formatCurrency(data.origamt)
            let printContent = {
              '优惠券名称：': data.name,
              '订单金额：': origamtAmt,
              '折扣金额：': orderAmt,
              '兑换数量：': `x${data.goods_cnt}`,
              '兑换码：': data.redeem_code,
              '兑换状态：': '成功',
              '兑换门店：': data.shopname,
              '兑换时间：': data.redeem_time
            }
            bridge.receiptPrint({
              title: '核券记录',
              jsonContent: JSON.stringify(printContent)
            })
          }
          this.$toast('核销成功！')
          setTimeout(() => {
            window.location.reload()
          }, 800)
        } else {
          this.$toast('兑换码无效~')
        }
      })
    },
    printTicket(redeemCode) {
      this.$Indicator.open('打印中...')
      this.$http({
        url: `${config.oHost}mchnt/special/verify_info`,
        method: 'GET',
        params: {
          format: 'cors',
          code: redeemCode
        }
      }).then(response => {
        this.$Indicator.close()
        let res = response.data
        if (res.respcd === '0000') {
          let data = response.data.data
          let orderAmt = '￥' + this.formatCurrency(data.pay_amt)
          let origamtAmt = '￥' + this.formatCurrency(data.origamt)
          let printContent = {
            '优惠券名称：': data.name,
            '订单金额：': origamtAmt,
            '折扣金额：': orderAmt,
            '兑换数量：': `x${data.goods_cnt}`,
            '兑换码：': data.redeem_code,
            '兑换状态：': '成功',
            '兑换门店：': data.shopname,
            '兑换时间：': data.redeem_time
          }
          bridge.receiptPrint({
            title: '核券记录',
            jsonContent: JSON.stringify(printContent)
          })
        } else {
          this.$toast('打印失败~')
        }
      })
    }
  }
}
</script>
