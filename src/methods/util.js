/**
 * Created by aidenZou on 16/5/5.
 */
const ua = navigator.userAgent

let isWX = function () {
  var ua = navigator.userAgent
  return (/MicroMessenger/i).test(ua)
}

let isAPP = function () {
  var ua = navigator.userAgent
  return (/QMMWD/i).test(ua)
}
let isAndroid = function () {
  var ua = navigator.userAgent
  return ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1
}
let isBaipaiApp = function () {
  let ua = navigator.userAgent
  return ua.indexOf('bggroupid') >= 0
}

// 获取 url 请求参数
let getRequestParams = function (url) {
  url = url || window.location.search
  url = decodeURIComponent(url)
  var Request = {}
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    let strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      var _key = strs[i].split('=')[0]
      _key && (Request[_key] = strs[i].split('=')[1])
    }
  }
  return Request
}
// 截取 url query
let getRequestQuerys = function (url) {
  url = url || window.location.search
  url = decodeURIComponent(url)
  var Request = {}
  if (url.indexOf('?') !== -1) {
    var index = url.indexOf('?')
    var str = url.substr(index + 1)
    let strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      var _key = strs[i].split('=')[0]
      _key && (Request[_key] = strs[i].split('=')[1])
    }
  }
  return Request
}

let isEmptyObject = function (obj) {
  /* eslint-disable no-unused-vars */
  let name
  for (name in obj) {
    return false
  }
  return true
}

let isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

let setTitle = (title) => {
  document.title = title
  if (isIOS) {
    let iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    iframe.setAttribute('src', 'https://m.baidu.com/favicon.ico')
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.onload = function () {
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 0)
    }
    document.body.appendChild(iframe)
  }
}

/*
* 日期格式化
* by hujiajia
*/
let formatDate = (date, fmt) => {
  var o = {
    'M+': date.getMonth() + 1,               // 月份
    'd+': date.getDate(),                    // 日
    'h+': date.getHours(),                   // 小时
    'm+': date.getMinutes(),                 // 分
    's+': date.getSeconds(),                 // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds()             // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

exports.isWX = isWX()
exports.isAPP = isAPP()
exports.isAndroid = isAndroid()
exports.getRequestParams = getRequestParams
exports.getRequestQuerys = getRequestQuerys
exports.isBaipaiApp = isBaipaiApp
exports.isEmptyObject = isEmptyObject
exports.setTitle = setTitle
exports.formatDate = formatDate
