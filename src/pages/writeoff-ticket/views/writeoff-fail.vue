<template lang="html">
  <div class="content">
    <div class="info_view1">
      <div class="suc_view">
        <div class="tickt_info">
          <div class="writeoff_result">
            <img src="../img/ic_failure@2x.png">
            <p>核销失败</p>
          </div>
          <div class="ticket_info">
            <span>备注</span>
            <span>{{ respmsg }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="btn_view">
      <p class="btn_full" @click="goWriteOff()">重新验券</p>
      <p class="btn_no_full" @click="goShouye()">返回首页</p>
    </div>
  </div>
</template>

<script>
import bridge from 'methods/bridge-v2'
import util from 'methods/util'

export default {
  data () {
    return {
      respmsg: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      util.setTitle('验券结果')
    })
  },
  created () {
    this.respmsg = this.$route.params.respmsg
  },
  methods: {
    goShouye () {
      bridge.close({
        type: '1'
      })
    },
    goWriteOff () {
      this.$router.replace({name: 'openscan'})
    }
  }
}
</script>

<style lang="scss" type="scss" scoped>
div {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.content {
  width: 100%;
  height: 100vh;
  background-color: #F7F7F7;
  padding-top: 32px;
  -webkit-font-smoothing: antialiased;
}
.info_view1 {
  width: 95%;
  margin: 0 auto;
}
.suc_view {
  width: 100%;
}
.tickt_info {
  width: 100%;
  height: 384px;
  background-color: #fff;
  border: 2px solid #E5E5E5;
  border-radius: 6px;
  padding: 0 30px;
}
.writeoff_result {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: 290px;
  border-bottom: 2px dashed #E5E5E5;
  padding-top: 50px;
  img {
    width: 120px;
    height: 120px;
  }
  p {
    width: 100%;
    text-align: center;
    font-size: 36px;
    font-family:PingFangSC-Regular;
  }
}
.ticket_info {
  height: 90px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
  color: #606470;
  font-size: 30px;
}
.btn_view {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0px 20px 40px;
  p {
    width: 100%;
    height: 88px;
    border-radius: 6px;
    text-align: center;
    line-height: 88px;
    font-size: 34px;
  }
}
.btn_full {
  background-color: #FF8100;
  color: #fff;
  margin-bottom: 30px;
}
.btn_no_full {
  color: #FF8100;
  background-color: #fff;
  border: 2px solid #FF8100;
}
</style>
