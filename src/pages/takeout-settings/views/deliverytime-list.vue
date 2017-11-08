<template>
  <div class="container">
    <div class="listcontainer">
      <ul class="list">
        <li v-for="(item, index) in timelist">
          <em @click="editdeliverytime(index, 'edit')">{{item.start_time | subStr(5)}}-{{item.end_time | subStr(5)}}</em>
          <span @click="deleteTime(index)">删除</span>
        </li>
      </ul>
    </div>
    <button class="addbtn default-button" @click="newdeliverytime('new')">
      + 添加时段
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
    computed: {
      settings () {
        return this.$store.getters.getSettings
      },
      timelist () {
        return this.settings.durations
      }
    },
    methods: {
      editdeliverytime (index, tag) {
        this.$router.push({name: 'deliverytime'})
        window.sessionStorage.index = index
        window.sessionStorage.tag = tag
      },
      newdeliverytime (tag) {
        this.$router.push({name: 'deliverytime'})
        window.sessionStorage.tag = tag
      },
      deleteTime (index) {
        if (this.timelist.length === 1) {
          this.$toast('最少要有一个可配送时间段')
          return
        }
        this.$http({
          // url: `${config.dcHost}diancan/mchnt/editdurations`,
          url: 'http://172.100.109.31:9300/diancan/mchnt/editdurations',
          method: 'POST',
          params: {
            action: 'delete',
            duration_id: this.timelist[index].duration_id,
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            this.timelist.splice(index, 1)
          }
        })
      }
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
      overflow: auto;
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
          flex: 1;
        }
        span {
          color: #A7A9AE;
          font-size: 24px;
          flex: none;
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
