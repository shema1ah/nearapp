<template>
  <div class="wrapper">
    <ul>
      <li v-for="record in records" @click="viewDetail(record)" :class="{'succeed': record.status === 'S', 'failed': record.status === 'F', 'pending': record.status === 'P'}">
        <div>
          <span class="title">提现</span>
          <span class="money"><sub>￥</sub>{{record.cashout_amount | formatCurrency}}</span>
        </div>
        <div>
          <span class="date">{{record.datetime}}</span>
          <span class="status">{{statusText(record.status)}}</span>
        </div>
      </li>
    </ul>
    <infinite-loading @infinite="fetchData" spinner="spiral">
      <span slot="no-more" class="no-more">没有更多了</span>
      <no-data :visible="true" class="no-data" slot="no-results"></no-data>
    </infinite-loading>
  </div>
</template>
<script>
  import config from 'methods/config'
  import noData from '../components/nodata.vue'
  import bridge from 'methods/bridge-v2'
  import InfiniteLoading from 'vue-infinite-loading'
  export default {
    data () {
      return {
        records: [],
        page: 1,  // 当月数据的页数
        monthIndex: 0,
        threeMonths: []
      }
    },
    components: {
      noData, InfiniteLoading
    },
    created () {
      bridge.setNavTitle({
        title: '提现记录'
      })
      this.calMonths()
    },
    methods: {
      statusText(status) {
        switch (status) {
          case 'S':
            return '提现成功'
          case 'P':
            return '提现处理中'
          case 'F':
            return '提现失败'
        }
      },
      calMonths () {
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth() + 1
        this.calOneMonth(year, month)
        if (month === 1) {
          year -= 1
          month = 12
        } else {
          month -= 1
        }
        this.calOneMonth(year, month)
        month = today.getMonth() + 1
        if (month === 1) {
          year -= 1
          month = 11
        } else if (month === 2) {
          year -= 1
          month = 12
        } else {
          month -= 2
        }
        this.calOneMonth(year, month)
      },
      calOneMonth (year, month) {
        let monthStr = year + (month <= 9 ? `0${month}` : month)
        this.threeMonths.push(monthStr)
      },
      fetchData($state) {
        this.$http({
          url: `${config.o2Host}withdraw/v1/wallet/cash`,
          method: 'JSONP',
          params: {
            page: this.page,
            page_size: 20,
            choose_dmt: this.threeMonths[this.monthIndex],
            format: 'jsonp'
          }
        }).then((res) => {
          let records = res.data.data.cashout_list
          if (res.data.respcd === '0000') {
            this.records = this.records.concat(records)
            this.page ++
            if (records.length < 20) {
              this.monthIndex ++
              this.page = 1
              if (this.monthIndex <= 2) { // 加载最近3个月
                $state.loaded()
              } else {
                $state.complete()
              }
            } else {
              $state.loaded()
            }
          }
        })
      },
      viewDetail (record) {
        let recordString = decodeURI(JSON.stringify(record))
        this.$router.push({
          name: 'detail',
          query: {
            record: recordString
          }
        })
      }
    }
  }
</script>
<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  @import "../../../styles/base/var";

  .wrapper {
    font-size: 26px;
  }

  ul {
    margin: 0;
    padding-left: 30px;
    list-style: none;
  }
  li {
    padding: 20px 60px 20px 0;
    border-bottom: 0.03rem solid #E5E5E5;
    background: url('../assets/arrow-right.svg') no-repeat center right 30px;
    background-size: 18px 34px;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:first-child {
        margin-bottom: 12px;
      }
      span {
        display: block;
      }
    }
    .title, .money{
      font-size: 30px;
    }
    .date {
      color: $aluminium;
    }
    .status {
      color: #60B700;
    }
    &.failed {
      .status {
        color: #FF3D1F;
      }
      .title, .money{
        color: $aluminium;
      }
    }
    &.succeed .status{
      color: #71D321;
    }
    &.pending .status{
      color: $orange;
    }
  }
  .no-more {
    background-color: #fff;
    display: block;
    padding: 20px 0
  }
</style>
