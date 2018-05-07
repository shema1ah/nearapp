<template>
  <div class="container">
    <div v-if="hasdata">
      <div class="search_box">
        <input type="text" v-model="value" placeholder="请输入门店名称" @input="matchData()">
      </div>
      <div class="record_list">
        <ul>
          <li v-for="items in shoplist" @click="getdetail(items.shopid, items.shopname)">
            <div class="img_box">
              <img :src="items.logo" alt="">
            </div>
            <div class="user_msg">
              <p class="shopname">{{items.shopname}}</p>
              <p class="login_id">账号：{{items.login_account}}</p>
            </div>
            <div class="arrow"></div>
          </li>
        </ul>
        <div class="Tips" v-if="searched && hasdata">
          <p>{{tiptext}}</p>
        </div>
      </div>
    </div>
    <!-- loading -->
    <loading :visible="loading"></loading>
    <div class="no_more" v-if="!value && !loading">
      没有更多了...
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import util from 'methods/util'
  import config from 'methods/config'
  import loading from 'components/loading/juhua.vue'
  import bridge from 'methods/bridge-v2'

  export default {
    data () {
      return {
        value: '',
        shoplist: [],
        searched: '',
        tiptext: '',
        loading: false,
        hasdata: false,
        msg: '',
        loadmore: null
      }
    },
    components: {
      loading
    },
    created () {
      this.request()
      util.setTitle('划款记录')
    },
    mounted () {
      // 禁掉ios下拉刷新功能
      this.pageRefresh()
    },
    methods: {
      // 调用原生的ios禁止下拉刷新功能
      pageRefresh () {
        bridge.pageRefresh({
          close: '1'
        })
      },
      // 查看详情
      getdetail (id, shopname) {
        this.$router.push({name: 'balance', query: {shopid: id, shopname: shopname}})
      },
      // 获取门店列表
      request () {
        this.loading = true
        this.$http({
          url: `${config.oHost}mchnt/user/shops`,
          method: 'jsonp',
          params: {
            need_all: 'all',
            format: 'jsonp'
          }
        })
        .then((res) => {
          let data = res.data
          if (data.respcd === config.code.OK) {
            this.hasdata = true
            this.loading = false
            this.shoplist = data.data.shops
            window.localStorage.setItem('shoplist', JSON.stringify(data.data.shops))
          }
        })
      },
      matchData () {
        this.shoplist = JSON.parse(window.localStorage.getItem('shoplist'))
        let _this = this
        let reg = new RegExp(_this.value, 'i')
        let searchedshoplist = []
        _this.shoplist.map((item, index) => {
          if (reg.test(_this.shoplist[index].shopname)) {
            searchedshoplist.push(item)
          }
        })
        _this.searched = searchedshoplist.length === 0 ? 1 : 0
        _this.tiptext = '找不到店铺，请检查输入是否有误'
        _this.shoplist = searchedshoplist
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../../../styles/global.scss";
  body {
    background: #F7F7F7;
  }
  .container {
    width: 100%;
    height: 100%;
  }
  .search_box {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    > input {
      width: 690px;
      height: 80px;
      outline: none;
      border: 3px solid #EFEFEF;
      border-radius: 6px;
      font-size: 30px;
      color: #A7A9AE;
      text-indent: 68px;
      background: url('../assets/search.png') no-repeat;
      background-position: 20px center;
      background-size: 32px 36px;
      background-color: #fff;
    }
  }
  .record_list {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    padding-left: 30px;
    > ul {
      width: 100%;
      > li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 152px;
        border-bottom: 3px solid #F7F7F7;
        .user_msg {
          flex: 1;
          line-height: 50px;
          .shopname {
            font-size: 30px;
            color: #000;
          }
          .login_id {
            font-size: 26px;
            color: #606470;
          }
        }
        .img_box {
          margin-right: 30px;
          > img {
            width: 90px;
            height: 90px;
            border-radius: 8px;
          }
        }
        .arrow {
          width: 20px;
          height: 32px;
          background: url('../assets/arrow.png') no-repeat;
          background-size: 100% 100%;
          margin-right: 30px;
        }
      }
    }
    .Tips {
      width: 100%;
      height: 100%;
      text-align: center;
      font-size: 40px;
      line-height: 1000px;
    }
  }
</style>
