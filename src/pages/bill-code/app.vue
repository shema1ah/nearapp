<template>
  <div class="container">
    <div id="qrcodeContainer"></div>
    <p class="tip">* 保存后可自行打印</p>
    <img id="bg" @load="dosomething($event)" src="./img/bg.jpg" alt="扫码开票" style="display:none">
    <div class="placeholder"></div>
    <button @click="beforeUpload()" type="button" class="modify-btn">保存到相册</button>
  </div>
</template>

<script>
import bridge from 'methods/bridge'
import { Indicator } from 'qfpay-ui'
import config from 'methods/config'
import QRCode from 'qrcode'

export default {
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    dosomething () {
      this.getUid()
    },
    getUid () {
      Indicator.open()
      this.$http({
        url: `${config.shHost}merchant/ids`,
        method: 'GET',
        params: {
          format: 'cors'
        }
      }).then((res) => {
        let data = res.data
        if (data.respcd === '0000') {
          this.urlToQrcode(data.data.hashid)
        } else {
          Indicator.close()
          this.$toast(data.respmsg)
        }
      }).catch(() => {
        Indicator.close()
        this.$toast('网络错误，请重试')
      })
    },
    urlToQrcode (userid) {
      let _qrcodeUrl = `${config.mHost}paydone/billcode-page.html?userid=${userid}`
      let qrcode = document.createElement('canvas')
      QRCode.toCanvas(qrcode, _qrcodeUrl, {scale: 20, margin: 0}, function (err) {
        if (err) throw err
      })
      this.drawQrcodeCanvas(qrcode)
    },
    drawQrcodeCanvas (qrcode) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      canvas.width = 1430
      canvas.height = 1960
      ctx.rect(0, 0, canvas.width, canvas.height)
      ctx.fill()

      let bg = document.getElementById('bg')
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

      let qrcodeCtx = qrcode.getContext('2d')
      let imgData = qrcodeCtx.getImageData(0, 0, qrcode.width, qrcode.height)
      ctx.putImageData(imgData, 345, 578)
      document.getElementById('qrcodeContainer').append(canvas)
      Indicator.close()
    },
    beforeUpload () {
      Indicator.open()
      this.$http({
        url: 'https://openapi.qfpay.com/tool/v1/qiniu_token',
        params: {
          appcode:	'40F12F92A55747B8AD759E05968A331D',
          func:	'upload',
          format:	'cors',
          ext: 'jpg'
        }
      }).then((res) => {
        let data = res.data
        if (data.respcd === '0000') {
          let token = data.data.token
          let key = data.data.key
          this.uploadFile(token, key)
        } else {
          Indicator.close()
          this.$toast('获取七牛token失败')
        }
      }).catch(() => {
        Indicator.close()
        this.$toast('获取七牛token失败')
      })
    },
    isAPP () {
      var ua = navigator.userAgent
      return (/QMMWD/i).test(ua)
    },
    dataURLtoBlob (dataurl) {
      let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {type: mime})
    },
    uploadFile (token, key) {
      let canvas = document.getElementById('qrcodeContainer').childNodes[0]
      let dataURL = canvas.toDataURL('image/jpeg')
      let blob = this.dataURLtoBlob(dataURL)

      let formData = new FormData()
      formData.append('file', blob)
      formData.append('token', token)
      formData.append('key', key)

      this.$http.post('https://upload.qiniup.com/', formData, {
        credentials: false
      })
      .then((res) => {
        Indicator.close()
        if (!res.data.key) {
          this.$toast('下载失败')
          return false
        }
        let url = `https://o95yi3b1h.qnssl.com/${res.data.key}`
        if (this.isAPP()) {
          this.downloadFile(url)
        } else {
          window.open(url, '_blank')
        }
      }).catch(() => {
        Indicator.close()
        this.$toast('上传七牛失败')
      })
    },
    downloadFile (url) {
      bridge.download({
        url
      })
    }
  }
}
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
@import "../../styles/base/reset";
@import "../../styles/base/qfpay-ui";
.container {
  background-color: #f7f7f7;
  height: 100vh;
}
#qrcodeContainer {
  text-align: center;
  padding-top: 5vw;
  canvas {
    width: 90%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
}
.tip {
  font-size: 30px;
  line-height: 3;
  padding-left: 5vw;
  color: #A7A9AE;
}
.placeholder {
  height: 90px;
}
.modify-btn {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  cursor: pointer;
  padding: 0;
  height: 90px;
  border: none;
  background-color: #FF8100;
  color: #fff;
  font-size: 32px;
}
</style>
