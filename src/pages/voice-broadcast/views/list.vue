<template lang="html">
  <div id="container">
    <div class="top-desc">
      <div class="top-desc-title">安卓系统的限制</div>
      <div class="top-desc-content">{{content}}</div>
    </div>
    <div class="phone-list">
      <ul>
        <li class="phone-list-item" v-for="item in DataList" @click="goDetail(item.detail, item.name)">{{item.name}}<span class="arrow"></span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import config from 'methods/config'
import bridge from 'methods/bridge-v2'
export default {
  data () {
    return {
      content: '', // 系统描述
      DataList: [] // 数据列表
    }
  },
  created () {
    this.getData()
    bridge.setNavTitle({
      title: '语音播报'
    })
  },
  methods: {
    getData () {
      this.$http({
        url: `${config.oHost}mchnt/user/brand/list`,
        method: 'GET',
        params: {
          format: 'cors'
        }
      }).then(response => {
        let res = response.data
        if (res.respcd === '0000') {
          this.content = res.data.content
          this.DataList = res.data.brands
        } else {
          this.$toast(res.resperr)
        }
      })
    },
    goDetail (data, name) {
      this.$router.push({name: 'detail', params: {detailData: data, title: name}})
    }
  }
}
</script>

<style lang="scss">
  #container {
    width: 100%;
    min-height: 100vh;
    background-color: #F7F7F7;
    padding-top: 32px;
  }
  .top-desc {
    width: 100%;
    background-color: #fff;
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
    .top-desc-title {
      font-size: 30px;
      color: #606470;
      padding: 30px 0px;
      margin-left: 30px;
      border-bottom: 2px solid #E5E5E5;
    }
    .top-desc-content {
      font-size: 30px;
      padding: 26px 28px 30px 30px;
    }
  }
  .phone-list {
    width: 100%;
    background-color: #fff;
    margin-top: 22px;
    font-size: 30px;
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
    ul {
      padding-left: 30px;
    }
    .phone-list-item {
      padding: 30px 0;
      border-bottom: 2px solid #E5E5E5;
      padding-right: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:last-child {
        border-bottom: none;
      }
      .arrow {
        display: inline-block;
        width: 16px;
        height: 32px;
        background: url('../assets/arrow.png') no-repeat;
        background-size: 100% 100%;
        margin-left: 16px;
        vertical-align: middle;
      }
    }
  }
</style>
