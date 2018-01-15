<template lang="html">
  <div>
    <div class="container">
      <div class="content_box" v-for="(items, index) in content">
        <div class="title_text_box">
          <p class="number">{{index + 1}}</p>
          <span class="title_text">
            {{items.question}}
          </span>
        </div>
        <ul>
          <li v-for="i in items.answer">{{i}}</li>
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
        loading: false,
        content: []
      }
    },
    created () {
      this.request()
    },
    components: {
      loading
    },
    methods: {
      request () {
        this.loading = true
        this.$http({
          url: `${config.oHost}mchnt/member/message/introductions`,
          method: 'GET',
          params: {
            format: 'cors'
          }
        }).then((res) => {
          this.loading = false
          let data = res.data
          if (data.respcd === config.code.OK) {
            this.content = data.data.content
          } else {
            this.$toast(data.resperr)
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
  body, html {
    height: 100%;
  }
  .mint-toast-text {
    font-size: 24px;
    margin: 10px 20px;
  }
  .container {
    height: 100%;
    margin-top: 30px;
    padding: 0 30px;
  }
  .content_box {
    margin-bottom: 32px;
    .title_text_box {
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
      .number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: url("../assets/list2.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 32px;
        font-size: 20px;
        color: #fff;
        margin: 8px 14px 0 0;
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
        background: url("../assets/list.png") no-repeat;
        background-size: 10px 10px;
        background-position: 14px 22px;
        padding-left: 46px;
      }
    }
  }
</style>
