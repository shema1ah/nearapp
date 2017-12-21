<template>
  <div class='bottom'>
    <span class="addPicture">
      <img :src="imgSrc" v-if="item"/>
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
    props: ['tag', 'id'], // 上传的文件双向绑定

    data () {
      return {
        file: {
          currentfile: '' // 当前要上传的文件
        },
        item: ''
      }
    },
    computed: {
      imgSrc() {
        let a = this.item
        let index = a.lastIndexOf('/')
        let forward = a.slice(0, index + 1)
        let after = a.slice(index + 1)
        a = forward + 'large_' + after
        return a
      }
    },

    methods: {
      handleUploadSuccess (info) {
        this.showtip('上传成功')
        this.item = info.url
        this.$emit('getValue', info.name, this.tag)
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
            this.showtip('请上传小于5M图片')
            // 清空
            this.file.currentfile = ''
            return
          }
          Indicator.open('上传中...')
          let oMyForm = new FormData()
          oMyForm.append('file', files[0])

          this.file.currentfile = ''
          this.$http.post(`${config.imgUpload}/util/v1/uploadfile?category=1&source=2&tag=${this.tag}&userid=${this.id}&format=cors`, oMyForm, {
            headers: {
              enctype: 'multipart/form-data'
            }
          }).then(
            (res) => {
              Indicator.close()
              let data = res.data
              if (data.respcd === config.code.OK) {
                this.handleUploadSuccess(data.data)
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
      width: 240px;
      padding: 4px 8px;
      position: relative;
    }

    .addPicture {
      position: relative;
      display: inline-block;

    }
    img {
      width: 240px;
      height: 240px;
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
