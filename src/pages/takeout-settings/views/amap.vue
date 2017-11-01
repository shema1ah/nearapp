<template>
  <div id="outter" v-show="visible">
    <p class="tip"><i>＊</i>超过范围会提示用户，但依然可以下单</p>
    <figure id="map">
      <img :src="imgUrl" alt="配送范围地图">
      <div id="circle" :style="circlestyle"></div>
      <i id="marker"></i>
    </figure>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['visible', 'distance', 'location'],
    data () {
      return {
        data: {
          zoom: 14,
          radius: 35,
          imgUrl: this.imgUrl,
          circlestyle: this.circlestyle
        }
      }
    },
    computed: {
      switchZoomRadius () {
        let scope = this.distance
        switch (true) {
          case scope === 0.5:
            this.zoom = 14
            this.radius = 50
            break
          case scope === 1:
            this.zoom = 13
            this.radius = 54
            break
          case (scope >= 1.5 && scope <= 2.5):
            this.zoom = 12
            this.radius = 37 + (scope - 1.5) * 20
            break
          case (scope >= 3 && scope <= 4.5):
            this.zoom = 11
            this.radius = 33 + (scope - 3) * 14
            break
          case (scope >= 5 && scope <= 9.5):
            this.zoom = 10
            this.radius = 30 + (scope - 5) * 6
            break
          case (scope >= 10 && scope <= 23.5):
            this.radius = 30 + (scope - 10) * 2
            this.zoom = 9
            break
          case (scope >= 24 && scope <= 47):
            this.radius = 35 + (scope - 24) * 1
            this.zoom = 8
            break
          case (scope >= 47 && scope <= 68):
            this.radius = 30 + (scope - 47) * 0.8
            this.zoom = 7
            break
          case (scope >= 68 && scope <= 99):
            this.radius = 30 + (scope - 68) * 0.4
            this.zoom = 6
            break
          default:
            this.radius = 50
            this.zoom = 14
        }
      },
      imgUrl () {
        this.zoom = this.switchZoomRadius || this.zoom
        return '//restapi.amap.com/v3/staticmap?zoom=' + this.zoom + '&size=512*512&location=' + this.location + '&key=9eb1cfce5386a0d7ad316255968c78bd'
      },
      circlestyle () {
        return 'width:' + this.switchZoomRadius || this.radius + 'vw' + ';height:' + this.switchZoomRadius || this.radius + 'vw;'
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" type="scss" rel="stylesheet/scss" scoped>
#outter {
  padding: 0 30px;
  background-color: #fff;
  border-bottom: 2px solid #E5E5E5;
  &.trans {
    padding-bottom: 0;
  }
  .tip {
    padding: 0;
  }
}
#map {
  position: relative;
  margin: 0;
  height: 60vw;
  overflow: hidden;
  margin-bottom: 30px;
  img {
    width: 100%;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
  }
}
.alignCenter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#circle {
  width: 53vw;
  height: 53vw;
  transition: all .3s;
  @extend .alignCenter;
  border-radius: 50%;
  border: 2px solid #FF8100;
  background-color: rgba(225,129,0,0.2);
}
#marker {
  @extend .alignCenter;
  width: 26px;
  height: 42px;
  background-image: url("../assets/marker.png");
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
