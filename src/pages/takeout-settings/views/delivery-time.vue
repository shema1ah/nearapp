<template>
  <div class="delivery-time-container">
    <div class="slider-container">
      <strong>
        <span>请拖动圆点选择时间区间</span>
      </strong>
      <div id="slider"></div>
      <div class="slider-remark">
        <p class="tx-l">00:00</p>
        <p class="tx-l">06:00</p>
        <p>12:00</p>
        <p class="tx-r">18:00</p>
        <p class="tx-r">24:00</p>
      </div>
    </div>
    <button class="default-button savebtn" @click="save()">保存</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import noUiSlider from 'nouislider'
  import utils from 'methods/util'
  export default {
    data () {
      return {
        data: {
        }
      }
    },
    computed: {
      settings () {
        return this.$store.getters.getSettings
      },
      durationsArr () {
        return this.settings.durations
      },
      getIndex () {
        return Number(window.sessionStorage.index)
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (window.sessionStorage.tag === 'new') {
          utils.setTitle('配送时段')
        } else {
          utils.setTitle('配送时段' + (Number(window.sessionStorage.index) + 1))
        }
      })
    },
    mounted () {
      this.$nextTick(() => {
        let slider = document.getElementById('slider')
        let _this = this
        noUiSlider.create(slider, {
          start: [0, 48],
          tooltips: true,
          step: 1,
          connect: true,
          range: {
            'min': 0,
            'max': 48
          },
          format: {
            to: function (value) {
              let intValue = parseInt(value)
              let hour = (intValue / 2) >= 10 ? Math.floor(intValue / 2) : '0' + Math.floor(intValue / 2)
              let minute = intValue % 2 === 1 ? '30' : '00'
              return hour + ':' + minute
            },
            from: function (value) {
              return value
            }
          }
        })
        let stNumber = this.type(window.sessionStorage.tag) === 0 ? 0 : this.transTimeToNum(_this.durationsArr[_this.getIndex].start_time)
        let edNumber = this.type(window.sessionStorage.tag) === 0 ? 48 : this.transTimeToNum(_this.durationsArr[_this.getIndex].end_time)
        document.getElementById('slider').noUiSlider.set([stNumber, edNumber])
      })
    },
    methods: {
      transTimeToNum (time) {
        let mTime = time.substr(0, 5)
        let m = Number(mTime.split(':')[1]) >= 30 ? 1 : 0
        let h = Number(mTime.split(':')[0]) * 2
        return m + h
      },
      type (tag) {
        return tag === 'new' ? 0 : 1
      },
      // 新增配送时间段
      addrequest () {
        let time = document.getElementById('slider').noUiSlider.get()
        let data = {
          start_time: time[0] + ':00',
          end_time: time[1] + ':00'
        }
        this.$http({
          url: `${config.oHost}diancan/mchnt/editdurations`,
          method: 'POST',
          params: {
            duration: JSON.stringify(data),
            action: 'add',
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            let newTime = {}
            newTime.start_time = time[0]
            newTime.end_time = time[1]
            newTime.duration_id = res.data.duration_id
            this.durationsArr.push(newTime)
            this.$router.go(-1)
          } else {
            this.$toast(res.resperr)
          }
        })
      },
      editrequest () {
        let time = document.getElementById('slider').noUiSlider.get()
        let _this = this
        let data = {
          start_time: time[0] + ':00',
          end_time: time[1] + ':00'
        }
        this.$http({
          url: `${config.oHost}diancan/mchnt/editdurations`,
          method: 'POST',
          params: {
            duration: JSON.stringify(data),
            action: 'modify',
            duration_id: _this.durationsArr[this.getIndex].duration_id,
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            this.durationsArr[this.getIndex].start_time = time[0]
            this.durationsArr[this.getIndex].end_time = time[1]
            this.$router.go(-1)
          } else {
            this.$toast(res.resperr)
          }
        })
      },
      save () {
        if (window.sessionStorage.tag === 'new') {
          this.addrequest()
        } else {
          this.editrequest()
        }
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../assets/nouislider.min.css";
  .delivery-time-container {
    position: relative;
  }
  .slider-container {
    margin-top: 20px;
    padding: 30px 60px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    strong {
      display: block;
      font-weight: normal;
      background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNHB4IiBoZWlnaHQ9IjFweCIgdmlld0JveD0iMCAwIDQgMSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNDMgKDM4OTk5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5QYXRoIDU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNNC41LDAuNSBMMCwwLjUiIGlkPSJQYXRoLTUiIHN0cm9rZT0iI0U1RTVFNSI+PC9wYXRoPgogICAgPC9nPgo8L3N2Zz4=') left center repeat-x;
      text-align: center;
      color: #8A8C92;
      font-size: 28px;
      span {
        background-color: #fff;
        padding: 0 30px;
      }
    }
    p {
      font-size: 30px;
      color: #2F323A;
    }
    button {
      cursor: pointer;
      background-color: #FF8100;
      color: #fff;
      border-radius: 6px;
      font-size: 32px;
      border: none;
      width: 100%;
      height: 90px;
    }
  }
  #slider {
    margin-top: 90px;
    border: none;
    box-shadow: none;
    background-color: #fff;
    .noUi-base {
      height: 16px;
      border-radius: 32px;
      border: none;
      background: #fff url('../assets/slider.png') center center no-repeat;
      background-size: 100% 100%;
    }
    .noUi-connect {
      background-color: rgba(255,129,0,.25);
      top: 2px;
      bottom: 2px;
      box-shadow: none;
    }
    .noUi-tooltip {
      width: 120px;
      color: #2F323A;
      font-size: 30px;
      padding: 5px 0 8px;
      background-color: transparent;
      border: none;
    }
    .noUi-handle {
      width: 40px;
      height: 40px;
      border-radius: 40px;
      background-color: #FF8100;
      border: 2px solid #fff;
      top: -14px;
      left: -.2rem;
      box-shadow: none;
      outline: none;
      &:before, &:after {
        background-color: transparent;
      }
    }
  }
  .slider-remark {
    display: flex;
    margin-top: 20px;
    margin-bottom: 50px;
    line-height: 1.4;
    p {
      text-align: center;
      color: #FF8100;
      font-size: 20px;
      flex: 1;
      &.tx-l {
        text-align: left;
      }
      &.tx-r {
        text-align: right;
      }
    }
  }
  .savebtn {
    width: 100%;
    height: 88px;
    font-size: 32px;
    position: fixed;
    bottom: 0;
    left: 0;
  }
</style>
