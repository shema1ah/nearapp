<template lang="html">
  <div class="list-warp">
    <div class="tab-item" v-for="item in tabdata" @click="goSupplement(item)">
      <img :src="item.icon" alt="">
      <p class="tab-item_name">{{ item.name }}</p>
      <p class="tab-item_endesc">{{ item.enDesc }}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bridge2 from 'methods/bridge-v2'
  export default {
    data () {
      return {
        tabdata: [{
          name: '商户信息',
          icon: require('../../../assets/patch-information/tab-icon1.png'),
          enDesc: 'Merchant Information',
          id: 'merchant-info'
        }, {
          name: '店铺信息',
          icon: require('../../../assets/patch-information/tab-icon2.png'),
          enDesc: 'Store Information',
          id: 'store-info'
        }, {
          name: '其它',
          icon: require('../../../assets/patch-information/tab-icon3.png'),
          enDesc: 'Other information',
          id: 'others'
        }]
      }
    },
    created () {
      bridge2.setNavBack({}, (res) => {
        bridge2.close()
      })
    },
    components: {
    },
    methods: {
      goSupplement (data) {
        this.$router.push('/' + data.id)
      }
    }
  }
</script>

<style lang="scss">
  .list-warp {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 30px;
    .tab-item {
      width: 330px;
      height: 380px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow:0px 4px 12px 0px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
      padding-top: 66px;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 256px;
      }
      .tab-item_name {
        font-size: 36px;
        margin-top: 24px;
      }
      .tab-item_endesc {
        font-size: 20px;
        color: #8A8C92;
        margin-top: 6px;
      }
    }
  }
</style>
