<template>
  <div class="container">
    <div id="qrcodeContainer"></div>
    <p class="tip">* 保存后可自行打印</p>
    <div class="placeholder"></div>
    <!-- <button @click="beforeUpload()" type="button" class="modify-btn">保存到相册</button> -->
  </div>
</template>

<script>
import bridge from 'methods/bridge'
import bridge2 from 'methods/bridge-v2'
import { Indicator } from 'qfpay-ui'
import config from 'methods/config'
import QRCode from 'qrcode'

export default {
  data () {
    return {
      bggroupid: ''
    }
  },
  created () {
    this.loadImage()
    bridge2.pageRefresh({
      close: '1'
    })
  },
  methods: {
    loadImage () {
      let ua = navigator.userAgent
      let bggroupid = /bggroupid/.test(ua) ? ua.match(/bggroupid:(.*)(\/|\s)/)[1] : 'haojin'
      this.bggroupid = bggroupid
      let image = new Image()
      document.body.appendChild(image)
      image.id = 'bg'
      image.src = this.getBgUrl(bggroupid)
      image.onload = () => {
        this.getUid()
      }
    },
    getBgUrl (bggroupid) {
      switch (bggroupid) {
        case 'bpsh':
          return 'https://near.qfpay.com.cn/op_upload/156/152283268962.jpg'
        case 'vcb':
          return 'https://near.qfpay.com.cn/op_upload/156/152282069946.png'
        case 'youlitong':
          return 'https://near.qfpay.com.cn/op_upload/156/152265965775.jpg'
        case 'zhubaoqianbao':
          return 'https://near.qfpay.com.cn/op_upload/156/152265989993.jpg'
        case 'jdc':
          return 'https://near.qfpay.com.cn/op_upload/156/152265995306.jpg'
        case 'jjl':
          return 'https://near.qfpay.com.cn/op_upload/156/152266171721.jpg'
        case 'dfwy':
          return 'https://near.qfpay.com.cn/op_upload/156/152266171721.jpg'
        case 'lepay':
          return 'https://near.qfpay.com.cn/op_upload/156/152266171721.jpg'
        default:
          return 'https://wx.qfpay.com/nearapp/static/img/bg.3a40258.jpg'
      }
    },
    isAPP () {
      let ua = navigator.userAgent
      return (/QMMWD/i).test(ua)
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
    getAppid () {
      switch (this.bggroupid) {
        case 'bpsh':
          return ''
        case 'vcb':
          return 'wxd3ceac1c32ae3504'
        case 'youlitong':
          return 'wxe4d4a86c30c53a55'
        case 'zhubaoqianbao':
          return 'wx565f1d51154263bf'
        case 'jdc':
          return 'wx70953c32d6f68f87'
        case 'jjl':
          return 'wxf8b1a13a1378c855'
        case 'dfwy':
          return 'wx403bc1cc82785e24'
        case 'lepay':
          return 'wx468e2addbad77dd4'
        case 'baofuetong':
          return 'wxdd95cbca5032a315'
        case 'swhssh':
          return 'wxffa4536644f38cfe'
        case 'lesh':
          return 'wx6525ffe12083a0bd'
        case 'hbsh':
          return 'wx67a5d01174b83e81'
        case 'xcydsh':
          return 'wxd68fe27c16066da9'
        case 'xmyss':
          return 'wxe9fe6b96c75f8c22'
        default:
          return ''
      }
    },
    urlToQrcode (userid) {
      let appid = this.getAppid()
      let _qrcodeUrl = `${config.mHost}paydone/billcode-page.html?userid=${userid}&appid=${appid}`
      let qrcode = document.createElement('canvas')
      QRCode.toCanvas(qrcode, _qrcodeUrl, { width: 740, scale: 20, margin: 0 }, function (err) {
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
      document.getElementById('qrcodeContainer').appendChild(canvas)
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
#bg {
  display: none;
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
