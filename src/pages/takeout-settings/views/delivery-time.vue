<template>
  <div v-show="visible" @click.self="cancel($event)" class="mask">
    <div class="slider-container">
      <strong>
        <span>配送时段</span>
      </strong>
      <div id="slider"></div>
      <div class="slider-remark">
        <p class="tx-l">00:00</p>
        <p class="tx-l">06:00</p>
        <p>12:00</p>
        <p class="tx-r">18:00</p>
        <p class="tx-r">24:00</p>
      </div>
      <button @click="confirm" type="button">确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import noUiSlider from 'nouislider'
  export default {
    data () {
      return {
        data: {
        }
      }
    },
    props: ['visible'],
    computed: {
      settings () {
        return this.$store.getters.getSettings
      }
    },
    mounted () {
      this.$nextTick(() => {
        let slider = document.getElementById('slider')
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
        let stNumber = this.transTimeToNum(this.settings.start_time) === false ? 0 : this.transTimeToNum(this.settings.start_time)
        let edNumber = this.transTimeToNum(this.settings.end_time) === false ? 48 : this.transTimeToNum(this.settings.end_time)
        document.getElementById('slider').noUiSlider.set([stNumber, edNumber])
      })
    },
    methods: {
      transTimeToNum (time) {
        if (typeof time !== 'undefined') {
          let mTime = time.substr(0, 5)
          let m = Number(mTime.split(':')[1]) >= 30 ? 1 : 0
          let h = Number(mTime.split(':')[0]) * 2
          return m + h
        } else {
          return false
        }
      },
      confirm () {
        let time = document.getElementById('slider').noUiSlider.get()
        this.$http({
          url: `${config.dcHost}diancan/mchnt/editsetting`,
          method: 'POST',
          params: {
            start_time: time[0] + ':00',
            end_time: time[1] + ':00',
            format: 'cors'
          }
        }).then(response => {
          let res = response.data
          if (res.respcd === '0000') {
            if (!this.settings.ID) {
              window.localStorage.setItem('settingId', res.data.ID)
              this.$store.commit('UPDATEID', res.data.ID)
            }
            let starttime = time[0] + ':00'
            let endtime = time[1] + ':00'
            this.$store.commit('UPDATESTARTTIME', starttime)
            this.$store.commit('UPDATEENDTIME', endtime)
            this.$emit('hideDeliveryTime')
          } else {
            this.$toast(res.resperr)
          }
        })
      },
      cancel (e) {
        this.$emit('hideDeliveryTime')
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../assets/nouislider.min.css";
  .slider-container {
    padding: 30px 36px;
    background-color: #fff;
    border-radius: 8px;
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
  .mask {
    box-sizing: border-box;
    background-color: rgba(0,0,0,0.35);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    padding: 36% 30px 0;
    height: 100%;
  }
</style>
