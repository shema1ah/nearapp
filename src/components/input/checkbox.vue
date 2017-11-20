<template>
  <input ref="checkbox" type="checkbox" :checked="value" @change="changeEvents($event)">
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
      }
    },
    props: ['value'],
    mounted () {
    },
    methods: {
      changeEvents (e) {
        let val = e.target.checked ? 1 : 0
        this.$emit('oncheckboxchange', val)
      }
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss" scoped>
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    position: relative;
    width: 70px;
    height: 30px;
    margin: 0;
    outline: 0;
    border-radius: 22px;
    box-sizing: border-box;
    /*background: #49D321;*/
    vertical-align: baseline;
    &:before {
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      width: 70px;
      height: 30px;
      border-radius: 22px;
      transition: all .3s;
      background-color: #E5E5E5;
    }
    &:after {
      content: " ";
      position: absolute;
      top: -5px;
      left: 0;
      height: 36px;
      border-radius: 36px;
      transition: all .3s;
      width: 36px;
      background-color: #fff;
      border: 2px solid #E5E5E5;
      box-shadow: 0 1px 3px rgba(0,0,0,.4);
    }
    &:checked {
      border-color: #04be02;
      background-color: #04be02;
      &:before {
        transform: scale(0);
      }
      &:after {
        border: 2px solid #49D321;
        transform: translateX(34px);
      }
    }
  }
</style>
