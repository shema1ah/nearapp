<template lang="html">
  <div>
    <img :src="item" alt="" v-for="item in data" v-if="hasdata">
    <loading :visible='isloading'></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from 'methods/util'
  import loading from 'components/loading/juhua.vue'
  import config from 'methods/config'
  export default {
    data () {
      return {
        data: [],
        hasdata: false,
        isloading: false
      }
    },
    components: {
      loading
    },
    created () {
      this.request()
    },
    methods: {
      request () {
        this.loading = true
        this.$http({
          url: `${config.oHost}mchnt/voice/broadcast`,
          method: 'GET',
          params: {
            format: 'cors'
          }
        }).then((res) => {
          let data = res.data
          if (data.respcd === '0000') {
            this.loading = false
            this.hasdata = true
            if (utils.isAndroid) {
              this.data = data.data.android
            } else {
              this.data = data.data.ios
            }
          } else {
            this.$toast(data.respmsg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../../../styles/global.scss";

  .mint-toast-text {
    font-size: 24px;
    margin: 10px 20px;
  }
  body {
    padding: 0 40px;
  }
  img {
    display: block;
    width: 670px;
    margin: 20px 0;
  }
</style>
