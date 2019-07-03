<template>
  <div v-show="visible" class="no-data">
    <img src="../assets/no_data.png" alt="暂无数据">
    <p>暂无数据</p>
  </div>
</template>

<script>
  export default {
    props: ['visible'],
    data () {
      return {}
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .no-data {
    text-align: center;
    padding-top: 180px;
    img {
      max-width: 50%;
    }
    p {
      margin-top: 10px;
      font-size: 30px;
      color: #7b7b7b;
    }
  }
</style>
