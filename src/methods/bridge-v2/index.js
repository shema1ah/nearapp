/**
 * Created by aidenZou on 16/5/19.
 */
import util from '../util'
import Vue from 'vue'

// import bridgeNative from './native'
// import bridgeWeb from './web'

// let bridge = util.isAPP ? bridgeNative : bridgeWeb

// let bridge = require(util.isAPP ? './native' : './web')

let bridge
if (util.isAPP) {
  bridge = require('./native')
} else {
  bridge = require('./web')
}
Vue.prototype.$bridge = bridge

export default bridge
