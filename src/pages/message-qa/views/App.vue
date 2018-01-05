<template lang="html">
  <div>
    <div class="container">
      <div class="content_box">
        <div class="title_text_box">
          <p class="number"></p>
          <span class="title_text">
            fref
          </span>
        </div>
        <ul>
          <li></li>
        </ul>
      </div>
      <!-- loading -->
      <loading :visible="loading"></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import loading from 'components/loading/juhua.vue'
  import config from 'methods/config'
  export default {
    data () {
      return {
        hasdata: false,
        loading: false
      }
    },
    created () {
      // this.request()
      this.$toast('11111')
    },
    components: {
      loading
    },
    methods: {
      request () {
        this.loading = true
        this.$http({
          url: '',
          method: 'jsonp',
          params: {
            format: 'jsonp'
          }
        }).then((res) => {
          let data = res.data
          console.log(data)
          if (data.respcd === config.code.OK) {
            this.loading = false
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
  body {
  font-family: 'PingFang SC';
}
.mint-toast-text {
  font-size: 24px;
  margin: 10px 20px;
}
.container {
  width: 100%;
  height: 100%;
}
.box {
  width: 100%;
  margin-top: 30px;
  padding: 0 30px;
}
.content_box {
  margin-bottom: 32px;
  .title_text_box {
    height: 34px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    .number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      // background-image:url(./list2.png);
      background-size: 100% 100%;
      text-align: center;
      line-height: 36px;
      font-size: 20px;
      color: #fff;
      margin-right: 14px;
    }
    .title_text {
      flex: 1;
      font-size: 32px;
      color: #000;
      font-weight:bold;
    }
  }
  >ul {
    width: 100%;
    li {
      line-height: 50px;
      font-size: 30px;
      // background: url(./list.png) no-repeat;
      background-size: 10px 10px;
      background-position: 14px 22px;
      padding-left: 46px;
    }
  }
}
</style>
