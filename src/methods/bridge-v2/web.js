// 非app环境 不提供原生app方法
let nullFun = (data, cb) => {
  return false
}

exports.alert = nullFun
exports.toast = nullFun
exports.close = nullFun
exports.openUri = nullFun
exports.getDeviceInfo = nullFun
exports.getLocation = nullFun
exports.setNavTitle = nullFun
exports.setNavBack = nullFun
exports.setNavMenu = nullFun
exports.scanQrcode = nullFun
exports.share = nullFun
exports.webNotify = nullFun
exports.navToUri = nullFun
exports.initParams = nullFun
exports.copy = nullFun
exports.telephone = nullFun
