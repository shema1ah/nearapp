<template lang="html">
  <div class="view-warp">
    <div class="store-info">
      <div class="item">
        <span class="item-label">营业执照号</span>
        <div class="item-wrap item-wrap_large">
          <van-field v-model="licensenumber" placeholder="请输入营业执照号" input-align="right" maxlength="18"/>
        </div>
      </div>
      <div class="item item_height-auto">
        <span class="item-label">营业执照地址</span>
        <div class="item-wrap item-wrap_large">
          <van-field v-model="businessaddr" placeholder="限120字" type="textarea" input-align="right" :autosize="{minHeight: 48}" maxlength="120"/>
        </div>
      </div>
      <div class="item">
        <span class="item-label">营业执照开始日期</span>
        <div class="item-wrap">
          <div class="time-view" @click="showPopup('start')" :style="startDate ? 'color:#2F323A' : 'color:#A7A9AE'">
            {{ startDate ? startDate : '开始日期'}}
          </div>
        </div>
      </div>
      <div class="item">
        <span class="item-label">营业执照结束日期</span>
        <div class="item-wrap">
          <div class="time-view" @click="showPopup('end')" :style="endDate ? 'color:#2F323A' : 'color:#A7A9AE'">
            {{ endDate ? endDate : '结束日期'}}
          </div>
        </div>
      </div>
      <div class="item">
        <span class="item-label">经营地址省</span>
        <div class="item-wrap">
          <span class="item-wrap_addr">{{provinceAddr}}</span>
          <van-icon name="arrow-down" color="#606470" @click="checkPicker('province')"/>
        </div>
      </div>
      <div class="item">
        <span class="item-label">经营地址市</span>
        <div class="item-wrap">
          <span class="item-wrap_addr">{{cityAddr}}</span>
          <van-icon name="arrow-down" color="#606470" @click="checkPicker('city')"/>
        </div>
      </div>
      <div class="item">
        <span class="item-label">经营地址区、县</span>
        <div class="item-wrap">
          <van-field v-model="district" placeholder="请输入" type="tel" input-align="right" maxlength="120"/>
        </div>
      </div>
      <div class="item item_height-auto item_noborder">
        <span class="item-label">门店详细地址</span>
        <div class="item-wrap item-wrap_large">
          <van-field v-model="address" placeholder="请输入详细门店地址，如：街道、门牌号等" type="textarea" autosize maxlength="120"/>
        </div>
      </div>
    </div>
    <div class="img-view">
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="storeBaseInfo1" :tag="'openlicense'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="storeBaseInfo2" :tag="'licensephoto'"></imgupload1>
      </div>
    </div>
    <div class="img-view">
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="storeBaseInfo3" :tag="'rentalagreement'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="storeBaseInfo4" :tag="'shopphoto'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="storeBaseInfo5" :tag="'goodsphoto'"></imgupload1>
      </div>
      <div class="upload-item">
        <imgupload1 @getValue="getPhoto" :baseInfo="storeBaseInfo6" class="btn-down" :tag="'paypoint'"></imgupload1>
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
    <van-popup v-model="showPicker" position="bottom">
      <van-picker show-toolbar :columns="columns" :value-key="pickerType === 'province' ? 'areaname' : 'cityname'" @confirm="pickerConfirm" @cancel="pickerCancel"/>
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
      showPicker: false,
      isLoading: false,
      checkType: '',
      startDate: '',
      endDate: '',
      licensenumber: '',
      businessaddr: '',
      areaList: [],
      columns: [],
      provinceAddr: '',
      cityAddr: '',
      district: '',
      pickerType: '',
      address: '',
      storeBaseInfo1: {
        title: '开户许可证',
        defaultImg: require('../../../assets/patch-information/store-default_img1.png'),
        height: 125,
        desc: []
      },
      storeBaseInfo2: {
        title: '营业执照',
        defaultImg: require('../../../assets/patch-information/store-default_img2.png'),
        height: 223,
        desc: []
      },
      storeBaseInfo3: {
        title: '店铺租赁合同',
        defaultImg: require('../../../assets/patch-information/store-default_img3.png'),
        height: 223,
        desc: ['* 体现有申请人签字或盖章的信息，有租赁地址描述的信息']
      },
      storeBaseInfo4: {
        title: '店铺外景照片',
        defaultImg: require('../../../assets/patch-information/store-default_img4.png'),
        height: 223,
        desc: ['* 请上传真实的店铺照片，从店铺外面往店内拍摄大范围照片']
      },
      storeBaseInfo5: {
        title: '店铺内景照片',
        defaultImg: require('../../../assets/patch-information/store-default_img5.png'),
        height: 223,
        desc: ['* 请上传真实的店铺照片，保证画面清晰、完整拍摄到店内陈设情况']
      },
      storeBaseInfo6: {
        title: '收银台照',
        defaultImg: require('../../../assets/patch-information/store-default_img6.png'),
        height: 223,
        desc: ['* 面向收银台拍摄大范围照片']
      },
      openlicense: '',
      licensephoto: '',
      rentalagreement: '',
      shopphoto: '',
      goodsphoto: '',
      paypoint: ''
    }
  },
  created () {
    this.getArea()
    this.setNavBack()
  },
  components: {
    imgupload1
  },
  methods: {
    setNavBack () {
      let _this = this
      bridge2.setNavBack({}, (res) => {
        let status = _this.licensenumber || _this.businessaddr || _this.startDate || _this.endDate || _this.provinceAddr || _this.cityAddr || _this.district || _this.address || _this.openlicense || _this.licensephoto || _this.rentalagreement || _this.shopphoto || _this.goodsphoto || _this.paypoint
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
    checkPicker (model) {
      if (model === 'city' && this.provinceAddr === '') {
        Toast('请先选择经营地址省')
        return
      }
      if (model === 'province') {
        this.columns = this.areaList
      } else if (model === 'city') {
        this.columns = this.areaList[this.provinceIndex].cities
      }
      this.showPicker = true
      this.pickerType = model
    },
    pickerConfirm (value, index) {
      this.showPicker = false
      if (this.pickerType === 'province' && this.areaList[index].areaname !== this.provinceAddr) {
        this.cityAddr = ''
        this.district = ''
      } else if (this.pickerType === 'city' && this.areaList[this.provinceIndex].cities[index].cityname !== this.cityAddr) {
        this.district = ''
      }
      if (this.pickerType === 'province') {
        this.provinceAddr = this.areaList[index].areaname
        this.provinceIndex = index
      } else if (this.pickerType === 'city') {
        this.cityAddr = this.areaList[this.provinceIndex].cities[index].cityname
      }
    },
    pickerCancel (value, index) {
      this.showPicker = false
    },
    getArea () {
      this.$http.get(`${config.oHost}mchnt/tool/areacities`, {
        params: {
          format: 'cors'
        }
      }).then(
        (res) => {
          let data = res.data
          if(data.respcd === config.code.OK) {
            this.areaList = data.data.records
          }else {
            Toast(data.resperr)
          }
        },
        () => {
          Toast('获取省市列表失败')
        })
    },
    checkOut () {
      let status = this.licensenumber || this.businessaddr || this.startDate || this.endDate || this.provinceAddr || this.cityAddr || this.district || this.address || this.openlicense || this.licensephoto || this.rentalagreement || this.shopphoto || this.goodsphoto || this.paypoint

      if ((this.startDate && !this.endDate) || (!this.startDate && this.endDate)) {
        Toast('开始日期,结束日期必须同时存在')
        return false
      } else if (!/^([\da-z]{15}|[\da-z]{18})$/i.test(this.licensenumber) && this.licensenumber) {
        Toast('营业执照号格式不正确，请重新填写')
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
        param.licensestat_date = this.startDate.replace(/\//g, '-')
      }
      if(this.endDate) {
        param.licenseend_date = this.endDate.replace(/\//g, '-')
      }
      if(this.licensenumber) {
        param.licensenumber = this.licensenumber
      }
      if(this.businessaddr) {
        param.businessaddr = this.businessaddr
      }
      if(this.provinceAddr) {
        param.province = this.provinceAddr
      }
      if(this.cityAddr) {
        param.city = this.cityAddr
      }
      if(this.district) { // 区县
        param.district = this.district
      }
      if(this.address) {
        param.address = this.address
      }
      if(this.openlicense) {
        param.openlicense = this.openlicense
      }
      if(this.licensephoto) {
        param.licensephoto = this.licensephoto
      }
      if(this.rentalagreement) {
        param.rentalagreement = this.rentalagreement
      }
      if(this.shopphoto) {
        param.shopphoto = this.shopphoto
      }
      if(this.goodsphoto) {
        param.goodsphoto = this.goodsphoto
      }
      if(this.paypoint) {
        param.paypoint = this.paypoint
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
  .store-info {
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
  .item-wrap_addr {
    padding-right: 12px;
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
