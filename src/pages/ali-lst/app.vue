<template lang="html">
  <router-view></router-view>
</template>

<script type="text/ecmascript-6">
import bridge from 'methods/bridge-v2'

export default {
  data () {
    return {
      licenseNo: '',
      province: '',
      provinceId: '',
      city: '',
      cityId: '',
      area: '',
      areaId: '',
      street: ''
    }
  },
  created () {
    this.disableRefresh()
  },
  methods: {
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
.mint-indicator {
  .mint-indicator-text {
    font-size: 24px;
  }
}
</style>
