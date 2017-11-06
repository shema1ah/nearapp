<template>
  <div class="container">
    <div class="listcontainer">
      <ul class="list">
        <li @click="editdeliverytime(index)">
          <em>07:30-09:00</em>
          <span>删除</span>
        </li>
        <li>
          <em>07:30-09:00</em>
          <span>删除</span>
        </li>
      </ul>
    </div>
    <button class="addbtn default-button" @click="newdeliverytime()">
      +添加时段
    </button>
  </div>
</template>

<script type="text/ecmascript-6">
  import utils from 'methods/util'
  export default {
    data () {
      return {

      }
    },
    created () {
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        utils.setTitle('配送时段')
      })
    },
    methods: {
      editdeliverytime (index) {
        this.$router.push({name: 'deliverytime'})
      },
      newdeliverytime () {
        this.$router.push({name: 'deliverytime'})
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">

  html, body {
    height: 100%;
  }
  .container {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    .listcontainer {
      overflow: scroll;
    }
    .list {
      width: 100%;
      margin-top: 20px;
      padding-left: 0;
      background: #f7f7f7;
      li {
        border: none;
        background: #fff;
        margin-bottom: 20px;
        text-indent: 1em;
        em {
          color: #2F323A;
          font-size: 32px;
        }
        span {
          color: #A7A9AE;
          font-size: 24px;
        }
      }
    }
    .addbtn {
      width: 100%;
      height: 88px;
      font-size: 32px;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
    }
  }
</style>
