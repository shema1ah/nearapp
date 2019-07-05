<template>
  <div class='hj-upload-wrap'>
    <p class="hj-upload_title">{{ baseInfo.title }}</p>
    <div class="hj-upload_imgview" :class="baseInfo.height === 125 ? 'hj-upload_imgview_min' : 'hj-upload_imgview_max'" v-if="!isError">
      <img :src="item" v-if="item"/>
      <img :src="baseInfo.defaultImg" v-else/>
    </div>
    <div class="hj-upload_imgview" :class="baseInfo.height === 125 ? 'hj-upload_imgview_min' : 'hj-upload_imgview_max'" v-else>
      <div class="hj-upload_error">
        <img src="../../assets/patch-information/icon_defeated.png" alt="">
        <p>上传失败，请重新上传</p>
      </div>
    </div>
    <div class="hj-upload_desc" v-if="baseInfo.desc.length">
      <p class="hj-upload_desc_item" v-for="item in baseInfo.desc">{{item}}</p>
    </div>
    <div class="hj-upload_btn">
      上传图片
      <input type="file" class="hj-upload_btninput" accept="jpg,jpeg,png,gif;capture=camera" @change="chooseFile">
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import config from 'methods/config'
  import { Toast } from 'vant'
  export default {
    props: {
      baseInfo: {
        type: Object,
        required: true
      },
      tag: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        file: {
          currentfile: '' // 当前要上传的文件
        },
        item: '',
        isError: false
      }
    },
    computed: {
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
          Toast.loading({
            duration: 0,
            message: '图片上传中...'
          })
          let oMyForm = new FormData()
          oMyForm.append('file', files[0])

          this.file.currentfile = ''
          this.$http.post(`${config.imgUpload}/mchnt/tool/upfile?category=1&source=2&tag=${this.tag}&format=cors`, oMyForm, {
            headers: {
              enctype: 'multipart/form-data'
            }
          }).then(
            (res) => {
              Toast.clear()
              let data = res.data
              if (data.respcd === config.code.OK) {
                this.isError = false
                this.handleUploadSuccess(data.data)
              } else {
                this.isError = true
                this.showtip('图片太大了，请重新拍摄')
              }
            }, (res) => {
              // error callback
              this.isError = true
              Toast.clear()
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
.hj-upload-wrap {
  text-align: center;
  box-sizing: border-box;
  position: relative;
  height: 100%;
  .hj-upload_imgview {
    border-radius: 8px;
    overflow: hidden;
    &.hj-upload_imgview_min {
      height: 250px;
    }
    &.hj-upload_imgview_max {
      height: 446px;
    }
    img {
      max-width: 100%;
    }
    .hj-upload_error {
      height: 100%;
      background-color: #E8E8E8;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 120px;
        height: 120px;
      }
      p {
        font-size: 24px;
        color: #606470;
        text-align: center;
        margin-top: 20px;
      }
    }
  }

  .hj-upload_title {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 12px;
  }
  .hj-upload_desc {
    font-size: 20px;
    text-align: left;
    color: #606470;
    margin: 10px 0 20px;
  }
  .hj-upload_btn {
    position: relative;
    height: 64px;
    text-align: center;
    line-height: 64px;
    color: #FF8100;
    font-size: 28px;
    border: 2px solid #FF8100;
    border-radius: 6px;
    margin-top: 12px;
    .hj-upload_btninput{
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
  }
  &.btn-down {
    // display: flex;
    // flex-wrap: wrap;
    // align-items: flex-start;
    // .hj-upload_title {
    //   display: block;
    //   width: 100%;
    //   margin-bottom: 10px;
    // }
    position: relative;
    .hj-upload_btn {
      width: 100%;
      width: -webkit-fill-available;
      position: absolute;
      bottom: 0;
    }
  }
}

</style>
