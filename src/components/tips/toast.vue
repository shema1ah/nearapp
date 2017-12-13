<template>
  <div class="c-toast" v-show="visible">{{Msg}}</div>
</template>

<script type="text/ecmascript-6">
export default {
  props: ['msg'],
  data () {
    return {
      visible: false,
      Msg: this.msg
    }
  },
  watch: {
    'Msg': function (val) {
      if (val) {
        this.visible = true
        let _t = setTimeout(() => {
          this.visible = false
          this.Msg = ''
          clearTimeout(_t)
        }, 1500)
      }
    }
  },
  methods: {
    repeatShow (msg) {
      this.Msg = msg
      this.visible = true
      let _t = setTimeout(() => {
        this.visible = false
        clearTimeout(_t)
      }, 1500)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .c-toast {
    position: fixed;
    z-index: 9999;
    bottom: 1.5rem;
    left: 50%;
    border-radius: 0.15rem;
    padding: .35rem .5rem;
    background-color: #4f4f57;
    color: #fff;
    text-align: center;
    animation-fill-mode: both;
    animation: toast 0.5s;

    transform: translate3d(-50%, -1.5rem, 0);

    @keyframes toast {
      0% {
        opacity: 0;
        transform: translate3d(-50%, 0, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(-50%, -1.5rem, 0);
      }
    }
  }
</style>
