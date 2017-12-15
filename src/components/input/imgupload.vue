<template>
  <div class='bottom'>
    <span class="addPicture">
      <img :src="files" v-if='files'/>
      <img src="../../assets/add-picture.png" v-else/>
      <input type="file" class="upload-input" accept="jpg,jpeg,png,gif;capture=camera"
             @change="chooseFile">
    </span>
  </div>
</template>
<script type="text/ecmascript-6">
  import config from 'methods/config'
  import { Toast, Indicator } from 'qfpay-ui'
  import Vue from 'vue'
  export default {
    props: ['files', 'maxlength'], // 上传的文件双向绑定

    data () {
      return {
        file: {
          currentfile: '' // 当前要上传的文件
        }
      }
    },

    methods: {
      handleUploadSuccess (info) {
        this.files = info.url
        // this.$emit('confirm', this.files)
      },
      chooseFile (event) {
        const {files} = event.target
        if (files.length > 0) {
          let file0type = files[0].type
          let file0size = files[0].size
          if (!file0type) {
            this.showtip('不能上传非图片')
            // 清空
            this.file.currentfile = ''
            return
          }
          if (!(/.\/(jpg|jpeg|png|gif)/ig.test(file0type))) {
            this.showtip('不能上传非图片')
            // 清空
            this.file.currentfile = ''
            return
          }
          if (file0size > 5 * 1024 * 1024) {
            this.showtip('图片太大了')
            // 清空
            this.file.currentfile = ''
            return
          }
          Indicator.open()
          let oMyForm = new FormData()
          oMyForm.append('file', files[0])
          this.file.currentfile = ''

          this.$http.post(`${config.imgUpload}/util/v1/uploadfile`, oMyForm, {
            headers: {
              enctype: 'multipart/form-data'
            }
          }).then(
            (res) => {
              Indicator.close()
              let resdata = res.data
              if (resdata.result === 0) {
                this.handleUploadSuccess(resdata.data)
              } else {
                this.showtip('图片太大了，请重新拍摄')
              }
            }, (res) => {
              // error callback
              Indicator.close()
              this.showtip('网络不太稳定，请稍后再试')
            })
        }
      },
      showtip (info) {
        Toast(info)
      }
    }
  }
</script>

<style lang="scss">

  .bottom {
    padding-top: 20px;
    overflow: hidden;
    text-align: center;
    & > span {
      width: 30%;
      padding: 4px 8px;
      position: relative;
    }

    .addPicture {
      position: relative;
      display: inline-block;

    }
    img {
      width: 100%;
      border-radius: 8px;
      border: 1px solid #6b6969;
    }

  }

  .upload-input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
