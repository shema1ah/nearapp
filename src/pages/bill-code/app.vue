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
import QRCode from 'qrcode'

export default {
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.reset()
    })
  },
  data () {
    return {
      userid: ''
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
          this.userid = data.data.hashid
          this.urlToQrcode()
        } else {
          this.$toast(res.resperr)
        }

      })
    },
    urlToQrcode () {
      let _qrcodeUrl = `${config.mHost}paydone/billcode-page.html?userid=` + this.userid
      console.log(_qrcodeUrl)
      let qrcode = document.createElement('canvas')
      QRCode.toCanvas(qrcode, _qrcodeUrl, {scale: 8, margin: 0}, function (err) {
        if (err) throw err
      })
      this.drawQrcodeCanvas(qrcode)
    },
    drawQrcodeCanvas (qrcode) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      canvas.width = qrcode.width
      canvas.height = qrcode.height + 50
      ctx.rect(0, 0, qrcode.width, qrcode.height + 50)
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      ctx.fillStyle = '#fe9b20'
      ctx.font = 'bold 22px 黑体'
      ctx.textAlign = 'center'

      let qrcodeCtx = qrcode.getContext('2d')
      let imgData = qrcodeCtx.getImageData(0, 0, qrcode.width, qrcode.height)
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
  min-height: 100vh;
  .bg-view {
    width: 652px;
    height: 908px;
    margin: 200px auto 0;
    background: url('./img/bg.png') no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
}
.canvasView {
  canvas {
    width: 52%;
    margin-top: 28%;
    border: 3px solid #f2932f;
    border-radius: 6px;
    padding: 10px 10px 0;
  }
}

#qrcodeContainer {
  margin: 300px auto 0 auto;
  width: 296px;
  height: 346px;
}
</style>
