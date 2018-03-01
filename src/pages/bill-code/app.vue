<template>
  <div class="container">
    <div class="bg-view">
      <div id="qrcodeContainer"></div>
    </div>
  </div>
</template>

<script>
import bridge from 'methods/bridge-v2'
import config from 'methods/config'
import QRCode from 'qrcodejs2'

export default {
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.reset()
    })
  },
  data () {
    return {
    }
  },
  created () {
    this.getUid()
  },
  mounted () {
  },
  methods: {
    reset() {
      let tableNode = document.getElementById('tableQrcodeContainer')
      while (tableNode.firstChild) {
        tableNode.removeChild(tableNode.firstChild)
      }
      let qrcodeNode = document.getElementById('qrcodeContainer')
      while (qrcodeNode.firstChild) {
        qrcodeNode.removeChild(qrcodeNode.firstChild)
      }
    },
    getUid () {
      this.$http({
        url: `${config.shHost}merchant/ids`,
        method: 'GET',
        params: {
          format: 'cors'
        }
      }).then((res) => {
        let data = res.data
        if (data.respcd === '0000') {
          // this.urlToQrcode()
          this.qrcode(data.data.hashid) // 简单方式生成二维码
        } else {
          this.$toast(res.resperr)
        }

      })
    },
    qrcode (userid) {
      let _qrcodeUrl = `${config.mHost}paydone/billcode-page.html?userid=` + userid
      let qrcode = new QRCode('qrcodeContainer', {
        width: window.innerWidth / 2.55,
        height: window.innerWidth / 2.55, // 高度
        text: _qrcodeUrl // 二维码内容
      })
    },
    urlToQrcode () {
      let _qrcodeUrl = `${config.mHost}paydone/billcode-page.html?userid=` + this.userid
      let qrcode = document.createElement('canvas')
      QRCode.toCanvas(qrcode, _qrcodeUrl, {scale: 8, margin: 0}, function (err) {
        if (err) throw err
      })
      this.drawQrcodeCanvas(qrcode)
    },
    drawQrcodeCanvas (qrcode) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth / 2.55
      canvas.height = window.innerWidth / 2.55
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      let qrcodeCtx = qrcode.getContext('2d')
      let imgData = qrcodeCtx.getImageData(0, 0, window.innerWidth, window.innerWidth)
      ctx.putImageData(imgData, 0, 0)
      document.getElementById('qrcodeContainer').append(canvas)
    }
  }
}
</script>

<style lang="scss" type="scss" rel="stylesheet/scss" scoped>
@import "../../styles/global.scss";
.container {
  width: 100%;
  .bg-view {
    width: 652px;
    height: 908px;
    margin: 150px auto 0;
    background: url('./img/bg.png') no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
}

#qrcodeContainer {
  margin: 300px auto 0 auto;
  width: 296px;
  height: 346px;
}
</style>
