<template lang="html">
</template>

<script>
import bridge from 'methods/bridge-v2'

export default {
  data () {
    return {}
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.getRequest()
    })
  },
  methods: {
    getRequest () {
      bridge.scanQrcode({}, function (res) {
        window.alert(JSON.stringify(res.qrcode))
      })
    }
  }
}
</script>

<style lang="css">
</style>
