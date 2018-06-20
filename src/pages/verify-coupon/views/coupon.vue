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
        <img :src="record.img" alt="优惠券图标">
        <div>
          <h3>{{record.name}}</h3>
          <p class="code">兑换码 <em>{{record.code}}</em></p>
          <p class="footer"><time>{{record.ctime | splitDate}}</time><span>来自{{record.src}}</span></p>
        </div>
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
    }
  },
  created () {
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
        url: `${config.oHost}mchnt/coupon/dw/verify_list`,
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
    verifyCode (code = this.code) {
      if (!code) {
        this.$toast('兑换码不能为空')
        return false
      }
      this.isPending = true
      this.$Indicator.open('请稍后...')
      this.$http({
        url: `${config.oHost}mchnt/coupon/dw/verify`,
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
          this.$toast('核销成功！')
          setTimeout(() => {
            window.location.reload()
          }, 800)
        } else {
          this.$toast('兑换码无效~')
        }
      })
    }
  }
}
</script>
