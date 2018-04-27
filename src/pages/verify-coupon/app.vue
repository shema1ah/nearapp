<template lang="html">
  <div class="wrapper">
    <header>
      <form class="">
        <input type="text" placeholder="输入兑换码" v-model="code"><button @click="verifyCode()" :disabled="isPending" type="button">兑换</button>
      </form>
      <button type="button" @click="scanQrcode" class="scan-btn"><img src="./assets/scan.svg" alt="扫码二维码"></button>
    </header>
    <dl class="coupons" v-for="(item, index) in coupons">
      <dt v-show="index === 0 ? true : item.date !== coupons[index - 1].date">
        <strong>{{item.date | formatSlashDate}} 星期{{item.date | weekday}}</strong>
        <span>共<em>{{item.total_num}}</em>次</span>
      </dt>
      <dd v-for="record in item.records">
        <img :src="record.img" alt="XX优惠券">
        <div>
          <h3>{{record.name}}</h3>
          <p class="code">兑换码 <em>{{record.code}}</em></p>
          <p class="footer"><time>{{record.ctime | splitDate}}</time><span>来自{{record.src}}</span></p>
        </div>
      </dd>
    </dl>
    <infinite-loading @infinite="getCoupons" spinner="spiral">
      <span slot="no-more"></span>
      <span slot="no-results"><img src="../../assets/no-data.png" alt="暂无核销数据"><p>暂无核销数据</p></span>
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

<style lang="scss" type="scss" rel="stylesheet/scss">
@import "../../styles/base/reset";
@import "../../styles/base/qfpay-ui";
body {
  background-color: #F4F4F4;
}
.wrapper {
  header {
    padding: 24px 30px;
    background-color: #F4F4F4;
    display: flex;
    justify-content: center;
    form {
      flex: 1;
      margin-right: 30px;
      background-color: #fff;
      border: 2px solid #CECDCD;
      overflow: hidden;
      border-radius: 8px;
      input {
        &::placeholder {
          color: #8A8C92;
        }
        height: 72px;
        font-size: 30px;
        box-sizing: border-box;
        padding: 0 0 0 20px;
        width: 80%;
        caret-color: #FF8100;  // 改变光标颜色
        border: none;
      }
      button {
        font-size: 30px;
        padding: 0;
        vertical-align: top;
        cursor: pointer;
        display: inline-block;
        height: 100%;
        width: 20%;
        height: 72px;
        background-color: #FFF4E7;
        color: #FF8100;
      }
    }
    .scan-btn {
      background-color: #FF8100;
      border-radius: 8px;
      cursor: pointer;
      img {
        width: 48px;
        height: 48px;
        vertical-align: bottom;
      }
    }
  }
}
.coupons {
  font-size: 30px;
  background-color: #fff;
  border-bottom: 2px solid #e5e5e5;
  margin-bottom: 20px;
  dt {
    height: 90px;
    line-height: 90px;
    padding: 0 30px;
    border-bottom: 2px dashed #e5e5e5;
    text-align: right;
    color: #8A8C92;
    strong {
      float: left;
      font-weight: normal;
    }
    em {
      color: #ff8100;
    }
  }
  dd {
    margin-left: 30px;
    border-bottom: 2px solid #E5E5E5;
    padding: 24px 30px 20px 0;
    display: flex;
    justify-content: center;
    &:last-child {
      border-bottom: none;
    }
    > img {
      border-radius: 6px;
      width: 120px;
      height: 120px;
      margin-right: 20px;
    }
    > div {
      flex: 1;
      width: 70%;
      line-height: 1.4;
      color: #8A8C92;
      h3 {
        font-weight: normal;
        font-size: 30px;
        margin-top: -6px;
        color: #000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .code {
        font-size: 28px;
        line-height: 2;
        em {
          color: #606470;
        }
      }
      .footer {
        font-size: 26px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.infinite-status-prompt {
  img {
    margin-top: 10vh;
    width: 50%;
  }
  p {
    margin-top: 60px;
    font-size: 30px;
    color: #8A8C92;
  }
}
</style>
