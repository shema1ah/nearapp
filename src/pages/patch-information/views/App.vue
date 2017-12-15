<template lang="html">
  <div class="container" v-if="statuList.all_supplied && !loading">
    <div class="item">
      <mt-field label="注册手机号" placeholder="请输入注册手机号" v-model="statuList.mobile" readonly></mt-field>
    </div>
    <div class="item">
      <mt-field label="商户微信号" placeholder="请输入您的微信号" v-model="wechat_no"></mt-field>
    </div>
    <div class="item no-line" v-if="!statuList.licensephoto">
      <div class="top">商户营业执照</div>
      <imgupload @getValue="getPhoto" :tag="'licensephoto'" :id="statuList.id"></imgupload>
    </div>
    <div class="item no-line" v-if="!statuList.idcardfront">
      <div class="top">法人身份证正面</div>
      <imgupload @getValue="getPhoto" :tag="'idcardfront'" :id="statuList.id"></imgupload>
    </div>
    <div class="item no-line" v-if="!statuList.idcardback">
      <div class="top">法人身份证反面</div>
      <imgupload @getValue="getPhoto" :tag="'idcardback'" :id="statuList.id"></imgupload>
    </div>
    <div class="item no-line" v-if="!statuList.authcertphoto">
      <div class="top">关系证明授权书（营业执照为企业的需法人签字并盖公章，为个体工商户的法人签字摁手印）</div>
      <div><a href="http://near.m1img.com/op_upload/137/151324616824.png" download>点此下载文件，填写后重新上传</a></div>
      <imgupload @getValue="getPhoto" :tag="'authcertphoto'" :id="statuList.id"></imgupload>
    </div>
    <div class="item no-line">
      <div class="top">请参考下图进行填写）</div>
      <div class="bom"><img src="../../../assets/example.png"/></div>
    </div>
    <button class="modify-btn" type="button" @click="commit">提交</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import bridge from 'methods/bridge-v2'
  import { Toast, Indicator } from 'qfpay-ui'
  import imgupload from 'components/input/imgupload'

  export default {
    data () {
      return {
        loading: false,
        isLoading: false,
        statuList: {},
        wechat_no: null,
        licensephoto: '',
        authcertphoto: '',
        idcardfront: '',
        idcardback: ''
      }
    },
    created () {
      this.disableRefresh()
      this.$on('commit', (text) => {
        // alert(text)
      })
      this.getData()
    },
    components: {
      imgupload
    },
    methods: {
      getData() {
        this.loading = true
        Indicator.open()
        this.$http.get(`${config.oHost}mchnt/user/supplied_info`, {
          params: {
            format: 'cors'
          }
        }).then(
          (res) => {
            this.loading = false
            Indicator.close()
            let data = res.data
            if(data.respcd === config.code.OK) {
              this.statuList = data.data || {}
              if(this.statuList.all_supplied) {
                Toast('信息已完善')
                // window.location.href = 'https://h5.youzan.com/v2/feature/y5hr9a96?cid='
              }
            }else {
              Indicator.close()
              Toast(data.resperr)
            }
          },
          () => {
            this.loading = false
            Toast('请求失败')
          })
      },

      // 校验是否填写
      checkInfo() {
        console.log(this, this.licensephoto, 6)
        if(!this.wechat_no || (!this.statuList.licensephoto && !this.licensephoto) || (!this.statuList.authcertphoto && !this.authcertphoto) || (!this.statuList.idcardfront && !this.idcardfront) || (!this.statuList.idcardback && !this.idcardback)) {
          return false
        }
        return true
      },

      getPhoto(name, tag) {
        this[tag] = name
      },

      formatParams() {
        let param = {
          wechat_no: this.wechat_no,
          format: 'cors'
        }
        if(!this.statuList.licensephoto) {
          param.licensephoto = this.licensephoto
        }
        if(!this.statuList.authcertphoto) {
          param.authcertphoto = this.authcertphoto
        }
        if(!this.statuList.idcardfront) {
          param.idcardfront = this.idcardfront
        }
        if(!this.statuList.idcardback) {
          param.idcardback = this.idcardback
        }
        return param
      },

      commit() {
        if(!this.isLoading) {
          if(!this.checkInfo()) {
            Toast('请完善信息后提交')
            return
          }
          this.isLoading = true
          Indicator.open()
          let params = this.formatParams()
          this.$http.post(`${config.oHost}mchnt/user/supply_info`, params).then(
            (res) => {
              let data = res.data
              this.isLoading = false
              Indicator.close()
              if(data.respcd === config.code.OK) {
                Toast('补件成功')
                window.location.href = 'https://h5.youzan.com/v2/feature/y5hr9a96?cid='
              }else {
                Toast(data.resperr)
              }
            },
            () => {
              this.isLoading = false
              Indicator.close()
              Toast('请求失败')
            })
        }
      },

      disableRefresh () {
        bridge.pageRefresh({
          close: '1'
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../../../styles/global.scss";

  body {
    background-color: #f7f7f7;
  }
  .container {
    padding-top: 24px;
    box-sizing: content-box;
    padding-bottom: 90px;

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
    .item {
      font-size: 30px;
      padding: 24px 30px;
      margin-top: 18px;
      border-top: 2px solid #E5E5E5;
      border-bottom: 2px solid #E5E5E5;
      background-color: #fff;
      background-size: 15px auto;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .mint-cell {
        background-image: none;
      }
      .mint-cell-title {
        width: 200px;
        color: #606470;
      }
      .mint-cell-wrapper {
        background-image: none;
        font-size: 30px;
      }
      .mint-field-core {
        color: #2F323A;
      }
    }

    .no-line {
      display: block;
      .top {
        color: #606470;
      }
      .bom {
        text-align: center;
        padding-top: 20px;
        img {
          width: 90%;
        }
      }
    }
  }
  .mint-toast-text {
    font-size: 24px;
    margin: 10px 20px;
  }
</style>
