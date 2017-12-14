<template>
  <div class="container" v-if="!isComplete">
    <div class="form-control">
      <mt-field label="注册手机号" placeholder="请输入注册手机号" v-model="phone"></mt-field>
    </div>
    <div class="form-control">
      <div class="top">法人身份证正面</div>
      <imgupload :files="item.attachments" :maxlength=1></imgupload>

      <mt-field label="法人身份证正面" placeholder="请输入注册手机号" v-model="phone"></mt-field>
    </div>
    <div class="form-control">
      <div class="top">法人身份证反面</div>
      <imgupload :files="item.attachments" :maxlength=1></imgupload>
    </div>
    <button class="modify-btn" type="button" :disabled="isLoading">提交</button>
  </div>
</template>

<script type="text/ecmascript-6">
  // import config from 'methods/config'
  import bridge from 'methods/bridge-v2'
  import imgupload from 'components/input/imgupload'

  export default {
    data () {
      return {
        isLoading: false,
        isComplete: false,
        phone: null
      }
    },
    created () {
      this.disableRefresh()
      if(this.isComplete) {
        this.$toast('信息已完善')
      }
    },
    computed: {

    },
    components: {
    },
    methods: {
      disableRefresh () {
        bridge.pageRefresh({
          close: '1'
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../../../styles/global.scss";

  body {
    background-color: #f7f7f7;
  }
  .modify-btn {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    cursor: pointer;
    padding: 0;
    height: 90px;
    border: none;
    background-color: #FF8100;
    color: #fff;
    font-size: 32px;
  }

  .mint-toast-text {
    font-size: 24px;
    margin: 10px 20px;
  }
</style>
