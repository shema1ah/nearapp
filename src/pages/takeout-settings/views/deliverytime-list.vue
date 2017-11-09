<template>
  <div class="container">
    <ul class="timelist">
      <li v-for="(item, index) in timelist">
        <em @click="editdeliverytime(index, 'edit')">{{item.start_time | subStr(5)}}-{{item.end_time | subStr(5)}}</em>
        <button @click="deleteTime(index)">删除</button>
      </li>
    </ul>
    <button class="add-btn default-button" @click="newdeliverytime('new')">
      <i class="iconfont">&#xe600;</i>添加时段
    </button>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
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
          url: `${config.oHost}diancan/mchnt/editdurations`,
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

<style scoped lang="scss" type="scss" rel="stylesheet/scss">
@import "../../../styles/iconfont/iconfont.css";
.timelist {
  li {
    padding-left: 30px;
    background-color: #fff;
    display: flex;
    margin-top: 20px;
    align-items: center;
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
    justify-content: space-between;
  }
  em {
    font-size: 30px;
    color: #2F323A;
  }
  button {
    font-size: 24px;
    padding: 0;
    color: #A7A9AE;
    height: 90px;
    width: 90px;
  }
}
.add-btn {
  width: 100%;
  height: 88px;
  font-size: 32px;
  position: fixed;
  bottom: 0;
  left: 0;
  i {
    font-size: 32px;
  }
}
</style>
