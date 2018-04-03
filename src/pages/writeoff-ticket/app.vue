<template>
  <router-view></router-view>
</template>

<script>
import bridge from 'methods/bridge-v2'

export default {
  created () {
    bridge.pageRefresh({
      close: '1'
    }, function (res) {
    })
  }
}
</script>

<style lang="scss" type="scss">
@import "../../styles/_global.scss";
.mint-toast-text {
  font-size: 24px;
  margin: 10px 20px;
}
</style>
