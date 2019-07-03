<template lang="html">
  <div class="view-warp">
    <div class="identity-info">
      <div class="item identity-info_date">
        <span class="item-label">身份证有效期</span>
        <div class="item-wrap">
          <div class="time-view start-time" @click="showPopup('start')" :style="startDate ? 'color:#2F323A' : 'color:#A7A9AE'">
            {{ startDate ? startDate : '开始时间'}}
          </div>
          <span style="color: #606470;">-</span>
          <div class="time-view end-time" @click="showPopup('end')" :style="endDate ? 'color:#2F323A' : 'color:#A7A9AE'">
            {{ endDate ? endDate : '结束时间'}}
          </div>
        </div>
      </div>
      <div class="identity-info_img">
        <div class="upload-item">
          <imgupload1 @getValue="getPhoto" :baseInfo="identityBaseInfo1" :tag="'idcardfront'"></imgupload1>
        </div>
        <div class="upload-item">
          <imgupload1 @getValue="getPhoto" :baseInfo="identityBaseInfo2" :tag="'idcardback'"></imgupload1>
        </div>
        <div class="upload-item">
          <imgupload1 @getValue="getPhoto" :baseInfo="identityBaseInfo3" :tag="'idcardinhand'"></imgupload1>
        </div>
      </div>
    </div>
    <div class="card-info">
      <div class="item">
        <span class="item-label">银行预留手机号</span>
        <div class="item-wrap">
          <van-field v-model="bankmobile" maxlength="11" placeholder="请输入手机号" type="tel" input-align="right"/>
        </div>
      </div>
      <div class="card-info_img">
        <div class="upload-item">
          <imgupload1 @getValue="getPhoto" :baseInfo="cardBaseInfo1" :tag="'authbankcardfront'"></imgupload1>
        </div>
      </div>
    </div>
    <div class="creat-btn" @click="commit">提交</div>
    <van-popup v-model="showDatetimePicker" position="bottom">
      <van-datetime-picker
        v-model="timeDate"
        type="date"
        :formatter="formatter"
        @confirm="dateConfirm"
        @cancel="dateCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import config from 'methods/config'
import { formatDate } from 'methods/util'
import imgupload1 from 'components/input/imgupload1'
import { Toast, Dialog } from 'vant'
import bridge2 from 'methods/bridge-v2'

export default {
  data () {
    return {
      timeDate: new Date(),
      showDatetimePicker: false,
      isLoading: false,
      checkType: '',
      startDate: '',
      endDate: '',
      identityBaseInfo1: {
        title: '身份证正面照',
        defaultImg: require('../../../assets/patch-information/merchnt-default_img1.png'),
        height: 125,
        desc: []
      },
      identityBaseInfo2: {
        title: '身份证反面照',
        defaultImg: require('../../../assets/patch-information/merchnt-default_img2.png'),
        height: 125,
        desc: []
      },
      identityBaseInfo3: {
        title: '收款人手持身份证店内合影',
        defaultImg: require('../../../assets/patch-information/merchnt-default_img3.png'),
        height: 125,
        desc: []
      },
      bankmobile: '',
      cardBaseInfo1: {
        title: '银行卡正面照',
        defaultImg: require('../../../assets/patch-information/merchnt-default_img4.png'),
        height: 125,
        desc: []
      },
      idcardfront: '',
      idcardback: '',
      idcardinhand: '',
      authbankcardfront: ''
    }
  },
  created () {
    this.setNavBack()
  },
  components: {
    imgupload1
  },
  methods: {
    setNavBack () {
      let _this = this
      bridge2.setNavBack({}, (res) => {
        let status = _this.startDate || _this.endDate || _this.idcardfront || _this.idcardback || _this.idcardinhand || _this.bankmobile || _this.authbankcardfront
        if (status) {
          Dialog.confirm({
            title: '提示',
            message: '您有信息未提交，确定退出嘛'
          }).then(() => {
            _this.$router.replace('/tablist')
          }).catch(() => {
            _this.setNavBack()
          })
        } else {
          this.$router.replace('/tablist')
        }
      })
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return `${value}日`
    },
    showPopup (type) {
      this.showDatetimePicker = true
      this.checkType = type
      if (this[type + 'Date']) {
        this.timeDate = new Date(this[type + 'Date'])
      }
    },
    dateConfirm (value) {
      this.showDatetimePicker = false
      if (this.checkType === 'end' && this.startDate) {
        if (formatDate(value, 'yyyy/MM/dd') <= this.startDate) {
          Toast('结束日期必须大于开始日期,请重新选择')
          return
        }
      } else if (this.checkType === 'start' && this.endDate) {
        if (formatDate(value, 'yyyy/MM/dd') >= this.endDate) {
          Toast('开始日期必须小于结束日期,请重新选择')
          return
        }
      }
      this[this.checkType + 'Date'] = formatDate(value, 'yyyy/MM/dd')
    },
    dateCancel () {
      this.showDatetimePicker = false
    },
    getPhoto(name, tag) {
      this[tag] = name
    },
    checkOut () {
      let status = this.startDate || this.endDate || this.idcardfront || this.idcardback || this.idcardinhand || this.bankmobile || this.authbankcardfront

      if ((this.startDate && !this.endDate) || (!this.startDate && this.endDate)) {
        Toast('开始时间,结束时间必须同时存在')
        return false
      } else if (!status) {
        Toast('请完善信息再提交')
        return false
      }
      return true
    },
    formatParams() {
      let param = {
        format: 'cors'
      }
      if(this.startDate) {
        param.idstatdate = this.startDate.replace(/\//g, '-')
      }
      if(this.endDate) {
        param.idenddate = this.endDate.replace(/\//g, '-')
      }
      if(this.idcardfront) {
        param.idcardfront = this.idcardfront
      }
      if(this.idcardback) {
        param.idcardback = this.idcardback
      }
      if(this.idcardinhand) {
        param.idcardinhand = this.idcardinhand
      }
      if(this.bankmobile) {
        param.bankmobile = this.bankmobile
      }
      if(this.authbankcardfront) {
        param.authbankcardfront = this.authbankcardfront
      }
      return param
    },
    commit () {
      if (!this.isLoading) {
        if (this.checkOut()) {
          this.isLoading = true
          Toast.loading({
            duration: 0,
            message: '信息提交中...'
          })
          let params = this.formatParams()
          this.$http.post(`${config.oHost}mchnt/user/v1/fulfill`, params).then(
          (res) => {
            let data = res.data
            this.isLoading = false
            Toast.clear()
            if(data.respcd === config.code.OK) {
              this.$router.replace('/done')
            }else {
              Toast(data.resperr)
            }
          },
          () => {
            this.isLoading = false
            Toast.clear()
            Toast('请求失败')
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .upload-item {
    width: 334px;
    padding-bottom: 30px;
    padding-top: 10px;
  }
  .identity-info {
    background-color: #fff;
    .time-view {
      width: 184px;
      height: 64px;
      line-height: 64px;
      text-align: center;
      border: 2px solid #E5E5E5;
      color: #A7A9AE;
      &.start-time {
        margin-right: 10px;
      }
      &.end-time {
        margin-left: 10px;
      }
    }
  }
  .identity-info_img {
    padding: 20px 30px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .card-info_img {
    padding: 20px 30px 0;
  }
  .card-info {
    margin-top: 30px;
    background-color: #fff;
  }
  .creat-btn {
    width: 690px;
    height: 88px;
    text-align: center;
    line-height: 88px;
    margin: 30px auto;
    font-size: 34px;
    color: #fff;
    background-color: #FF8100;
    border-radius: 6px;
  }
</style>
