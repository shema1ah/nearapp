<template lang="html">
  <div class="content">
    <div class="info_view">
      <ul>
        <li>
          <span>券状态</span>
          <span>{{ ticketStatus }}</span>
        </li>
        <li>
          <span>券名称</span>
          <span>{{ ticketName }}</span>
        </li>
      </ul>
    </div>
    <div class="writeoff_btn" @click="writeOff()">
      <p>已与顾客确认，立即核销</p>
    </div>
  </div>
</template>

<script>
import bridge from 'methods/bridge-v2'
import config from 'methods/config'
import util from 'methods/util'

export default {
  data () {
    return {
      ticketStatus: '',
      ticketName: '',
      qrcode: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      util.setTitle('信息确认')
    })
  },
  created () {
    this.qrcode = this.$route.params.qrcode
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.$http({
        url: config.o2Host + '/merchant/koubei/ticket/info',
        method: 'GET',
        params: {
          ticket_code: this.qrcode,
          format: 'cors'
        }
      }).then((res) => {
        let data = res.data
        if (data.respcd === '0000') {
          this.ticketName = data.data.ticket_name
          this.ticketStatus = data.data.status_desc
        } else {
          this.$toast('获取卡券信息错误')
        }
      }).catch(() => {
        this.$toast('网络错误，请重试')
      })
    },
    writeOff () {
      this.$http({
        url: config.o2Host + '/merchant/koubei/ticket/use',
        method: 'POST',
        params: {
          ticket_code: this.qrcode,
          format: 'cors'
        }
      }).then((res) => {
        let data = res.data
        if (data.respcd === '0000') {
          this.$router.replace({name: 'writeoffresuc', params: {ticketName: this.ticketName}})
        } else {
          this.$router.replace({name: 'writeoffrefail', params: {respmsg: res.data.respmsg}})
        }
      }).catch(() => {
        this.$toast('网络错误，请重试')
      })
    }
  }
}
</script>

<style lang="scss" type="scss">
  div {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .content {
    width: 100%;
    height: 100vh;
    background-color: #F7F7F7;
    padding-top: 32px;
    -webkit-font-smoothing: antialiased;
  }
  .info_view {
    width: 100%;
    padding-left: 30px;
    padding-right: 30px;
    background-color: #fff;
    border-top: 2px solid #D8D8D8;
    border-bottom: 2px solid #D8D8D8;
    li {
      height: 90px;
      line-height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: space-between;
      :last-child {
        color: #8A8C92;
      }
    }
    li:first-child {
      border-bottom: 2px solid #E5E5E5;
    }
  }

  .writeoff_btn {
    width: 100%;
    height: 88px;
    position: absolute;
    bottom: 0;
    p {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 88px;
      background-color: #FF8100;
      color: #fff;
      font-size: 34px;
    }
  }
</style>
