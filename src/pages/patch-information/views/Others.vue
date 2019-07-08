<template lang="html">
  <div class="view-warp">
    <div class="other-info">
      <div class="item item_height-auto">
        <span class="item-label">汇付合同编号</span>
        <div class="item-wrap item-wrap_large">
          <van-field v-model="contract_no" placeholder="请输入" type="textarea"
          input-align="right" maxlength="40" :autosize="{ maxHeight: 60, minHeight: 24}" rows="1"/>
        </div>
      </div>
      <div class="item">
        <span class="item-label">汇付合同开始日期</span>
        <div class="item-wrap">
          <div class="time-view" @click="showPopup('start')" :style="startDate ? 'color:#2F323A' : 'color:#A7A9AE'">
            {{ startDate ? startDate : '开始日期'}}
          </div>
        </div>
      </div>
      <div class="item item_noborder">
        <span class="item-label">汇付合同结束日期</span>
        <div class="item-wrap">
          <div class="time-view" @click="showPopup('end')" :style="endDate ? 'color:#2F323A' : 'color:#A7A9AE'">
            {{ endDate ? endDate : '结束日期'}}
          </div>
        </div>
      </div>
    </div>
    <div class="img-view">
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="otherBaseInfo1" :tag="'unionpay_marketphoto'"></imgupload1 >
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="otherBaseInfo2" class="btn-down" :tag="'unionpay_equipment'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="otherBaseInfo3" class="btn-down" :tag="'unionpay_buglephoto'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="otherBaseInfo4" :tag="'checkstand_weixin'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="otherBaseInfo5" :tag="'checkin_weixin'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="otherBaseInfo6" class="btn-down" :tag="'checkstand_alipay'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="otherBaseInfo7" :tag="'checkin_alipay'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="otherBaseInfo8" class="btn-down" :tag="'authcertphoto'"></imgupload1>
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
        :min-date="minDate"
        :max-date="maxDate"
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
      minDate: new Date(new Date().getFullYear() - 30, 0, 1),
      maxDate: new Date(new Date().getFullYear() + 30, 11, 31),
      showDatetimePicker: false,
      checkType: '',
      startDate: '',
      endDate: '',
      contract_no: '',
      otherBaseInfo1: {
        title: '收银台+云闪付物料',
        defaultImg: require('../../../assets/patch-information/other-default_img1.png'),
        height: 223,
        desc: ['* 收银台照片中必须包含：二维码或手机闪付支付场景需要展示符合银联品牌规范的标识，包括但不限于银联受理标识（云闪付）、扫码立牌、随机立减活动海报等信息']
      },
      otherBaseInfo2: {
        title: '收银台+云闪付轻型扫码设备',
        defaultImg: require('../../../assets/patch-information/other-default_img2.png'),
        height: 223,
        desc: ['* 收银台照片中必须包含：具有符合银联品牌规范 logo（云闪付） 的轻型终端设备（智能pos 机除外）']
      },
      otherBaseInfo3: {
        title: '收银台+云闪付语音播报设备',
        defaultImg: require('../../../assets/patch-information/other-default_img3.png'),
        height: 223,
        desc: ['* 收银台照片中必须包含：具有符合银联品牌规范 logo（云闪付） 的语音播报设备']
      },
      otherBaseInfo4: {
        title: '收银台+支付宝蓝海',
        defaultImg: require('../../../assets/patch-information/other-default_img4.png'),
        height: 223,
        desc: ['* 收银台照片中必须包含：', '1. 扫码支付场景需要展示具有支付宝LOGO和"推荐使用支付宝"的提示。', '2. 收银台照片需体现支付宝花呗分期活动物料']
      },
      otherBaseInfo5: {
        title: '收银台+微信绿洲',
        defaultImg: require('../../../assets/patch-information/other-default_img5.png'),
        height: 223,
        desc: ['* 收银台照片中必须包含: ', '1. 扫码支付场景需要展示具有微信LOGO和"推荐使用微信支付"的提示。', '2. 收银台照片需要体现微信摇一摇活动海报。', '3. 业务人员或商户与收银台照片的合影，需与真实门店合影保持一致。']
      },
      otherBaseInfo6: {
        title: '餐饮平台入驻照_支付宝蓝海',
        defaultImg: require('../../../assets/patch-information/other-default_img6.png'),
        height: 223,
        desc: ['* 大众点评、美团、口碑、百度外卖、饿了么任选一个']
      },
      otherBaseInfo7: {
        title: '餐饮平台入驻照_微信绿洲',
        defaultImg: require('../../../assets/patch-information/other-default_img7.png'),
        height: 223,
        desc: ['* 大众点评、美团、口碑、百度外卖、饿了么任选一个']
      },
      otherBaseInfo8: {
        title: '业务代理合同或者协议',
        defaultImg: require('../../../assets/patch-information/other-default_img8.png'),
        height: 223,
        desc: []
      },
      unionpay_marketphoto: '',
      unionpay_equipment: '',
      unionpay_buglephoto: '',
      checkstand_weixin: '',
      checkin_weixin: '',
      checkstand_alipay: '',
      checkin_alipay: '',
      authcertphoto: ''
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
        let status = _this.startDate || _this.endDate || _this.contract_no || _this.unionpay_marketphoto || _this.unionpay_equipment || _this.unionpay_buglephoto || _this.checkstand_weixin || _this.checkin_weixin || _this.checkstand_alipay || _this.checkin_alipay || _this.authcertphoto
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
      let status = this.startDate || this.endDate || this.contract_no || this.unionpay_marketphoto || this.unionpay_equipment || this.unionpay_buglephoto || this.checkstand_weixin || this.checkin_weixin || this.checkstand_alipay || this.checkin_alipay || this.authcertphoto

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
        param.contract_sdate = this.startDate.replace(/\//g, '-')
      }
      if(this.endDate) {
        param.contract_edate = this.endDate.replace(/\//g, '-')
      }
      if(this.contract_no) {
        param.contract_no = this.contract_no
      }
      if(this.unionpay_marketphoto) {
        param.unionpay_marketphoto = this.unionpay_marketphoto
      }
      if(this.unionpay_equipment) {
        param.unionpay_equipment = this.unionpay_equipment
      }
      if(this.unionpay_buglephoto) {
        param.unionpay_buglephoto = this.unionpay_buglephoto
      }
      if(this.checkstand_weixin) {
        param.checkstand_weixin = this.checkstand_weixin
      }
      if(this.checkin_weixin) {
        param.checkin_weixin = this.checkin_weixin
      }
      if(this.checkstand_alipay) {
        param.checkstand_alipay = this.checkstand_alipay
      }
      if(this.checkin_alipay) {
        param.checkin_alipay = this.checkin_alipay
      }
      if(this.authcertphoto) {
        param.authcertphoto = this.authcertphoto
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
  .other-info {
    background-color: #fff;
    border-bottom: 2px solid #E5E5E5;
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
  .img-view {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 40px 30px 0;
    margin-top: 20px;
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
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
