/**
 * Created by aidenZou on 16/5/5.
 */
/**
 * 双向绑定中货币
 * 金额为0时展示空或者0
 */
exports.noneCurrency = {
  read (val, arg) {
    if (val === 0 && arg) {
      return ''
    } else {
      return val
    }
  },
  write (val) {
    return val
  }
}
/**
 * 双向绑定中货币格式化
 */
exports.twoWayCurrency = {
  read (val) {
    if (isNaN(val)) return
    if (val === 0) {
      return ''
    }
    return Number((val / 100).toFixed(2))
  },
  write (val) {
    val = val.replace(/[^\d.]/g, '')
    return parseInt(val * 100)
  }
}

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
 * 消除货币单位后多余的00000
 */
exports.noZeroCurrency = (number) => {
  return Number(number)
}

exports.uglyCurrency = (number) => {
  if (isNaN(number)) return
  return (parseFloat(number))
}

/**
 * 格式化货币
 */
exports.formatCurrency = (number) => {
  if (isNaN(number)) return
  number = (number / 100).toFixed(2)
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
  return ['一', '二', '三', '四', '五', '六', '日'][weekday - 1]
}

/**
 * 英文格式化星期
 * '1~7' | str 1 => 星期一
 */
exports.formatEnWeekDay = (weekday) => {
  if (isNaN(weekday)) return
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][weekday - 1]
}

/**
 * 格式化时间戳
 * 1461658688000 | formatTime "yyyy-MM-dd HH:mm:ss"
 */
exports.formatTime = (timeStamp, fmt, hasTodayText) => { // author: meizz
  if (!timeStamp) {
    return ''
  }
  var _timeStamp = parseInt(timeStamp)
  if (_timeStamp.toString().length === 10) {
    _timeStamp *= 1000
  }

  !fmt && (fmt = 'yyyy-MM-dd')
  var t = new Date(_timeStamp)
  var o = {
    'M+': t.getMonth() + 1, // 月份
    'd+': t.getDate(),      // 日
    'h+': t.getHours(),     // 小时
    'm+': t.getMinutes(),   // 分
    's+': t.getSeconds(),   // 秒
    'q+': Math.floor((t.getMonth() + 3) / 3), // 季度
    'S': t.getMilliseconds() // 毫秒
  }

  var now = new Date().getTime()
  var nowDate = new Date().getDate()
  // 排除掉上个月的同一天
  if (now - _timeStamp < 10 * 24 * 3600 * 1000) {
    if (nowDate - t.getDate() <= 1 && hasTodayText) {
      fmt = 'hh:mm:ss'
    } else if ((t.getDate() - nowDate > 10 && nowDate === 1) && hasTodayText) {
      fmt = 'hh:mm:ss'
    }
  }

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }

  // 排除掉上个月的同一天
  if (now - _timeStamp < 10 * 24 * 3600 * 1000) {
    if (nowDate === t.getDate() && hasTodayText) {
      return `今天 ${fmt}`
    } else if (nowDate - t.getDate() === 1 || (((t.getDate() - nowDate) > 10 && nowDate === 1) && hasTodayText)) {
      return `${fmt}`
    }
  }

  return fmt
}
