<template lang="html">
  <router-view></router-view>
</template>

<script type="text/ecmascript-6">
import bridge from 'methods/bridge-v2'
import config from 'methods/config'
import utils from 'methods/util'

export default {
  data () {
    return {
      visible: false,
      hasLicenseNo: false
    }
  },
  created () {
    this.disableRefresh()
    this.getData()
  },
  methods: {
    getData () {
      this.$Indicator.open()
      this.$http({
        url: `${config.oHost}mchnt/oauth/supplied`,
        method: 'GET',
        params: {
          format: 'cors'
        }
      }).then(response => {
        this.$Indicator.close()
        let res = response.data
        if (res.respcd === '0000') {
          if (res.data.is_auth_lst === 1) {
            window.location.replace('https://8.1688.com/wap/third.htm?thirdp=qfzf')
          } else {
            utils.setTitle('用户授权')
            let info = res.data
            delete info.is_auth_lst
            this.visible = true   // 首页显示
            this.hasLicenseNo = !!info.licenseNo
            this.$store.commit('UPDATEINFO', info)
          }
        }
      })
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
@import "../../styles/global.scss";
body {
  background-color: #F7F7F7;
}
.modify-btn {
  width: 100%;
  cursor: pointer;
  padding: 0;
  height: 90px;
  border: none;
  background-color: #FF8100;
  color: #fff;
  font-size: 32px;
  font-weight: 300;
  &:disabled {
    background-color: #A7A9AE;
  }
}
.mint-toast-text {
  font-size: 24px;
  margin: 10px 20px;
}
.mint-indicator-wrapper {
  border-radius: 6px;
}
.mint-indicator-spin {
  margin: 5vw 6vw;
  .mint-spinner-snake {
    width: 6vw !important;
    height: 6vw !important;
    border-width: 1vw;
  }
}
</style>
