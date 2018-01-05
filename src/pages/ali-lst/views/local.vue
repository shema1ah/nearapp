<template lang="html">
  <div class="wrapper">
    <nav v-show="!fromStreet">
      <menu @click="getData(0, 1)" :class="{'active': currentType === 1}">所在省</menu>
      <menu v-show="currentType === 2 || currentType === 3" :class="{'active': currentType === 2}" @click="getData(provinceId, 2)">所在市</menu>
      <menu v-show="currentType === 3" :class="{'active': currentType === 3}" @click="getData(cityId, 3)">所在区</menu>
    </nav>
    <ul class="area-list">
      <li v-for="area in areaList" @click="getData(area.area_id, area.full_name, area.name)">{{area.full_name}}</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import config from 'methods/config'
  import utils from 'methods/util'

  export default {
    data () {
      return {
        fromStreet: false,
        currentType: 0,   // 0 所有省，1 所在市， 2 所在县
        province: '',
        provinceId: '',
        city: '',
        cityId: '',
        areaList: []
      }
    },
    created () {
      let query = this.$route.query
      this.fromStreet = query.from && query.from === 'street'
      let title = this.fromStreet ? '收货所在街道' : '收货所在地区'
      utils.setTitle(title)
      if (query.from === 'street') {
        let areaId = window.sessionStorage.getItem('areaId')
        this.getData(areaId)
      } else {
        this.getData(0)
      }
    },
    computed: {
    },
    methods: {
      // pid 父级区域id
      // name 区域名称
      // type 区域类型  province、city、area、street
      getData(pid, name, type) {
        this.$Indicator.open()
        if (typeof name === 'number') {
          this.currentType = name
        } else {
          this.currentType += 1
        }

        if (type === 'province' && name) {
          this.province = name
          this.provinceId = pid
        } else if (type === 'city' && name) {
          this.city = name
          this.cityId = pid
        } else if (type === 'area' && name) {
          window.sessionStorage.setItem('areaId', pid)
          let location = {
            province: this.province,
            city: this.city,
            area: name
          }
          this.$store.commit('UPDATELOCATION', location)
          this.$router.replace({name: 'form'})
        } else if (type === 'street' && name) {
          this.$store.commit('UPDATESTREET', name)
          this.$router.replace({name: 'form'})
        }
        this.$http({
          url: `${config.oHost}mchnt/oauth/get_area/`,
          method: 'GET',
          params: {
            format: 'cors',
            pid
          }
        }).then(response => {
          this.$Indicator.close()
          let res = response.data
          if (res.respcd === '0000') {
            this.areaList = res.data
          } else {
            this.$toast(res.resperr)
          }
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped rel="stylesheet/scss">
  nav {
    font-size: 30px;
    background-color: #fff;
    color: #FF8100;
    margin-bottom: 20px;
    border-bottom: 2px solid #E5E5E5;
    menu {
      display: inline-block;
      padding-left: 0;
      padding-bottom: 18px;
      margin:24px 15px 0 30px;
      &.active {
        border-bottom: 4px solid #FF8100;
      }
    }
  }
  .area-list {
    background-color: #fff;
    padding-left: 30px;
    border-bottom: 2px solid #E5E5E5;
    font-size: 30px;
    li {
      padding: 24px 30px 20px 0;
      border-bottom: 2px solid #E5E5E5;
      &:active {
        color: #FF8100;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>
