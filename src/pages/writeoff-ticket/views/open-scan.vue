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
      let _this = this
      bridge.scanQrcode({}, function (res) {
        if(res.ret === 'OK') {
          _this.$router.replace({name: 'infoconfirm', params: {qrcode: res.qrcode}})
        } else {
          alert(res.ret)
        }
      })
    }
  }
}
</script>

<style lang="css">
</style>
