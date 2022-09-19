const api = require('./api')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const setStorage = (key, data) => {
  return wx.setStorage({
    key: key + '__' + api.version + '__',
    data: data,
  })
}

const getStorage = key => {
  try {
    return wx.getStorageSync(key + '__' + api.version + '__')
  } catch (e) {
    return null
  }
}


module.exports = {
  formatTime,
  setStorage,
  getStorage,
}
