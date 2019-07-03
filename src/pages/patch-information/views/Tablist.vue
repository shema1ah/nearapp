<template lang="html">
  <div class="view-warp">
    <div class="tab-item" v-for="item in tabdata" @click="goSupplement(item)">
      {{item.name}}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        tabdata: [{
          name: '商户信息',
          id: 'merchant-info'
        }, {
          name: '店铺信息',
          id: 'store-info'
        }, {
          name: '其它',
          id: 'others'
        }]
      }
    },
    created () {
    },
    components: {
    },
    methods: {
      goSupplement (data) {
        this.$router.replace('/' + data.id)
      }
    }
  }
</script>

<style lang="scss">
  .view-warp {
    .tab-item {
      padding: 20px 30px;
      font-size: 32px;
      border-bottom: 2px solid #ccc;
    }
  }
</style>
