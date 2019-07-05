<template>
  <router-view/>
</template>

<script>
  import bridge2 from 'methods/bridge-v2'
  export default {
    created() {
      bridge2.customNavStyle({
        backIconColor: '#ffffff',
        bgColor: '#FB8100',
        titleColor: '#ffffff'
      })
      bridge2.setNavTitle({
        title: '商户补件',
        bgcolor: '#FB8100',
        color: '#ffffff'
      })
      bridge2.pageRefresh({
        close: '1'
      })
    }
  }
</script>
<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../../styles/global.scss";
  @import "../../styles/base/vant.scss";
  body {
    background-color: #f7f7f7;
    -webkit-overflow-scrolling: touch;
    position: relative;
    min-height: 100vh;
  }
</style>
