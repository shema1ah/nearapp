<template lang="html">
  <div id="container">
    <ul>
      <li class="detail-item" v-for="(item, index) in detailData">
        <div class="detail-item-title">
          <div class="detail-item-title-index">{{ index + 1}}.</div>
          <div class="detail-item-title-desc">{{item.title}}</div>
        </div>
        <div class="detail-item-img">
          <img :src="item.img" alt="" v-if="item.img">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import bridge from 'methods/bridge-v2'
export default {
  data () {
    return {
      detailData: []
    }
  },
  mounted () {
    this.pageRefresh() // 禁止下拉刷新
  },
  created () {
    this.detailData = this.$route.params.detailData
    bridge.setNavTitle({
      title: this.$route.params.title + '教程',
    })
  },
  methods: {
    pageRefresh () {
      bridge.pageRefresh({
        close: '1'
      })
    }
  }
}
</script>

<style lang="scss">
  #container {
    padding-top: 32px;
    background-color: #F7F7F7;
    ul {
      width: 100%;
      background-color: #fff;
    }
    .detail-item {
      font-size: 28px;
      padding: 24px 0;
      .detail-item-title {
        padding: 0 30px;
        display: flex;
        .detail-item-title-index {
          line-height: 48px;
          font-size: 36px;
          color: #FF8100;
        }
        .detail-item-title-desc {
          flex: 1;
          padding-left: 10px;
          line-height: 48px;
        }
      }
      .detail-item-img {
        width: 570px;
        margin: 28px auto 0;
        box-shadow: 0px 4px 8px 0px #BABABA;
        overflow: hidden;
        img {
          width: 100%;
          display: block;
        }
      }
    }
  }
</style>
