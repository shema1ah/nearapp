<template lang="html">
  <div class="wrapper">
    <img src="../assets/info1.png" alt="店铺推广图示1">
    <img src="../assets/info2.png" alt="店铺推广图示2">
    <img src="../assets/info3.png" alt="店铺推广图示3">
  </div>
</template>

<script type="text/ecmascript-6">
  import bridge from 'methods/bridge-v2'
  export default {
    data () {
      return {
      }
    },
    created () {
      document.title = '店铺推广'
      bridge.setNavTitle({
        color: '#fff',
        bgcolor: '#F34040'
      })
    }
  }
</script>

<style lang="scss" type="scss" scoped rel="stylesheet/scss">
.wrapper {
  background: linear-gradient(to bottom, #F34040, #FF8100);
  img {
    width: 100%;
    vertical-align: bottom;
  }
}
</style>
