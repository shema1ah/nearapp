<template lang="html">
  <router-view></router-view>
</template>

<script type="text/ecmascript-6">
import config from '../../methods/config'
export default {
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$http({
      url: `${config.oHost}diancan/mchnt/settings`,
      method: 'JSONP',
      params: {
        format: 'jsonp'
      }
    }).then((response) => {
      let res = response.data
      let merchantInfo = res.data.merchant_info
      if (res.respcd === '0000') {
        this.$store.commit('UPDATESETTINGS', merchantInfo)
        if (merchantInfo.telephone && merchantInfo.longitude) {
          this.$router.replace({name: 'main'})
        } else {
          this.$router.replace({name: 'verify'})
        }
      } else {
        this.$toast(res.resperr)
      }
    })
  }
}
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
@import "../../styles/global.scss";

body {
  background-color: #f7f7f7;
}
.list {
  margin-top: 0;
  margin-bottom: 0;
  background-color: #fff;
  font-size: 30px;
  color: #2F323A;
  padding-left: 30px;
  border-top: 2px solid #E5E5E5;
  li {
    min-height: 90px;
    border-top: 2px solid #E5E5E5;
    padding-right: 30px;
    display: flex;
    align-items: center;
    &:first-child{
      border-top: none;
    }
    em {
      font-style: normal;
    }
  }
  span {
    flex: 1;
    text-align: right;
  }
}
.tel-input {
  width: 80%;
  height: 42px;
  font-size: 30px;
  text-align: right;
  border: none;
  padding: 0 10px 0 0;
  &:focus {
    outline: none;
  }
  &::-webkit-input-placeholder {
    color: #A7A9AE;
  }
}
.border-input {
  width: 90px;
  height: 56px;
  margin:0 10px;
  border: 2px solid #D8D8D8;
  border-radius: 6px;
  vertical-align: inherit;
  font-size: 30px;
  text-align: center;
  font-weight: 400;
  padding: 0;
  &.active {
    border-color: #FF8100;
  }
  &.warn {
    border-color: #FF2F00;
  }
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
.has-bb {
  border-bottom: 2px solid #E5E5E5;
}
.touch-btn {
  width: 44px;
  height: 44px;
  color: #A7A9AE;
  padding: 0;
  border: 2px solid #A7A9AE;
  background-color: #fff;
  border-radius: 6px;
  i {
    font-size: 24px;
  }
  &:disabled {
    opacity: 0.5;
  }
}
.item {
  font-size: 30px;
  padding: 24px 54px 24px 30px;
  margin-top: 18px;
  border-top: 2px solid #E5E5E5;
  border-bottom: 2px solid #E5E5E5;
  background:#fff url('assets/arrow.svg') no-repeat right 26px center;
  background-size: 15px auto;
  display: flex;
  align-items: center;
  &.multi-line {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  &.no-bb {
    border-bottom: none;
  }
  em {
    font-style: normal;
    color: #606470;
  }
  > span {
    flex: 1;
    text-align: right;
    color: #2F323A;
    i {
      font-style: normal;
      color: #FF8100;
    }
  }
}
.no-arrow {
  padding-right: 30px;
  background-image: none;
  background-color: #fff;
}
.item i {
  &.green {
    color: #1EC622;
  }
  &.red {
    color: #FD5359;
  }
}
</style>
