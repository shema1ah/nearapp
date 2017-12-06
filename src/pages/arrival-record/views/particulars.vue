<template lang="html">
  <div class="container">
    <ul class="particulars_list">
      <li @click="viewdetail()">
        <div>
          <p>
            <span>收款</span>
            <span>(待入账)</span>
          </p>
          <p>
            <span>2017/11/22</span>
            <span>周三</span>
          </p>
        </div>
        <div>
          <span>+300</span>
          <span class="arrow"></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {
    this.requestlist()
  },
  methods: {
    viewdetail () {
      this.$router.push({name: 'paymentDetails'})
    },
    requestlist () {
      this.$http({
        url: 'http://172.100.116.238:7200/account/record/',
        method: 'GET',
        params: {
          page: 1,
          month: '2017-11',
          format: 'cors'
        }
      })
    }
  }
}
</script>

<style lang="scss" type="scss">
@import "../../../styles/global.scss";
body {
  background: #F7F7F7;
}
.particulars_list {
  background: #fff;
  margin-top: 30px;
  li {
    height: 132px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    div:first-of-type {
      p:first-of-type span:first-of-type {
        font-size: 30px;
        color: #000;
      }
      p:first-of-type span:last-of-type {
        color: #FF8100;
        font-size: 26px;
      }
      p:last-of-type {
        color: #606470;
        font-size: 26px;
        margin-top: 20px;
      }
    }
    div:last-of-type {
      span:first-of-type {
        font-size: 32px;
        vertical-align: middle;
      }
    }
  }
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
</style>
