<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  @import "../../styles/global.scss";
  .mint-toast-text {
    font-size: 24px;
    margin: 10px 20px;
  }
  .mint-indicator-spin {
    margin: 5vw 6vw;
    .mint-spinner-snake {
      width: 6vw !important;
      height: 6vw !important;
      border-width: 1vw;
    }
  }
  body {
    background-color: #F7F7F7;
  }
  h3, strong {
    font-weight: normal;
  }
  sub {
    vertical-align: baseline;
  }
</style>
