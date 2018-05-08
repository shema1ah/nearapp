/**
 * 双向绑定距离格式化
 */
exports.twoWayDistance = {
  read (val) {
    if (isNaN(val)) return
    return Number((val / 1000).toFixed(1))
  },
  write (val) {
    return parseInt(val * 1000)
  }
}

/**
 * 格式化货币
 */
exports.formatCurrency = (number) => {
  if (isNaN(number)) return
  number = Number((number / 100).toFixed(2))
  return number
}
exports.formatCurrencyStr = (number) => {
  if (isNaN(number)) return
  number = (number / 100).toFixed(2)
  return number
}
/**
 * 格式化货币 (每隔三位一个逗号)
 */
exports.formatCurrencyThree = (number) => {
  let regex = /\d(?=(\d{3})+\.)/g
  return number.replace(regex, '$&,')
}
/**
 * 格式化货币 用于输入框 填0不填返回空字符串
 */
exports.formatCurrencyInput = (number) => {
  if (isNaN(number)) return
  if (number === 0) return ''
  number = Number((number / 100).toFixed(2))
  return number
}

/**
 * 千分位货币
 */
exports.thousandsFormatCurrency = (number) => {
  if (isNaN(number)) return
  number = (number / 100).toFixed(2)
  let str = number.toString()
  str = str.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  return str
}

/**
 * 格式化距离
 */
exports.formatDistance = (number) => {
  if (isNaN(number)) return
  return Number((number / 1000).toFixed(1))
}

/**
 * 字符串截取
 * '201604059' | subStr 4 => 2016
 * '201604059' | subStr -4 => 4059
 */
exports.subStr = (str, number) => {
  if (!str) return ''

  if (number < 0) {
    return str.substr(str.length + number)
  } else {
    return str.substr(0, number)
  }
}
/**
 * 格式化星期
 * '1~7' | str 1 => 星期一
 */
exports.formatWeekDay = (weekday) => {
  if (isNaN(weekday)) return
  return ['日', '一', '二', '三', '四', '五', '六'][weekday]
}
