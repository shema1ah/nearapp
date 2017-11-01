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
  return ua.indexOf('bggroupid') !== -1
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

/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数
 */
let throttle = function (func, wait, options) {
  var data = new Date()
  var now = data.getTime()
  var context, args, result
  var timeout = null
  // 上次执行时间点
  var previous = 0
  if (!options) options = {}
  // 延迟执行函数
  var later = function () {
    // 若设定了开始边界不执行选项，上次执行时间始终为0
    previous = options.leading === false ? 0 : now
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function () {
    // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
    if (!previous && options.leading === false) previous = now
    // 延迟执行时间间隔
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
    // remaining大于时间窗口wait，表示客户端系统时间被调整过
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    // 如果延迟执行不存在，且没有设定结尾边界不执行选项
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

exports.isWX = isWX()
exports.isAPP = isAPP()
exports.isAndroid = isAndroid()
exports.getRequestParams = getRequestParams
exports.isBaipaiApp = isBaipaiApp
exports.isEmptyObject = isEmptyObject
exports.throttle = throttle
exports.setTitle = setTitle
