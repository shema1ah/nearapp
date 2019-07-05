<template lang="html">
  <div class="view-warp">
    <div class="content">
      <img src="../../../assets/patch-information/iconfont-check.png" alt="">
      <p>已提交</p>
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
      bridge2.setNavBack({}, (res) => {
        this.$router.replace('/tablist')
      })
    },
    components: {
    },
    methods: {}
  }
</script>

<style lang="scss">
  .view-warp {
    overflow: hidden;
  }
  .content {
    margin-top: 150px;
    text-align: center;
    img {
      width: 92px;
    }
    p {
      font-size: 48px;
      color: #262626;
      margin-top: 50px;
    }
  }
</style>
