<template lang="html">
  <div class="container">
    <van-tabs @change="tabChange" background="#f7f7f7" title-active-color="#000000" color="#FB8100" line-width="33.33%">
      <van-tab title="商户信息"></van-tab>
      <van-tab title="店铺信息"></van-tab>
      <van-tab title="其它"></van-tab>
    </van-tabs>
    <div class="">
      <router-view />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bridge2 from 'methods/bridge-v2'
  export default {
    data () {
      return {
      }
    },
    created () {
      // 调用原生的ios禁止下拉刷新功能
      bridge2.pageRefresh({
        close: '1'
      })
      this.$router.replace('/main/merchant-info')
    },
    methods: {
      tabChange (index, title) {
        let option = {
          '0': 'merchant-info',
          '1': 'store-info',
          '2': 'others'
        }
        this.$router.replace('/main/' + option[index])
      }
    }
  }
</script>
<style lang="scss">
  .container {
    max-width: 1000px;
    margin: 0 auto;
  }
</style>
