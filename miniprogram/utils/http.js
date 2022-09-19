const api = require('./api.js')

const Request = (url, method = "GET", data = {}, header = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: method,
      url: api.apiUrl + url,
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        ...header
      },
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

const promiseRequest = function (uri, method = "GET", data = {}, Authorization = false) {
  let header = {}
  return new Promise((resolve, reject) => {
    if (Authorization) {
      const login = require('login.js')
      login.AuthHeader().then((cookie) => {
        header = { "Authorization": cookie }
        Request(uri, method, data, header).then((res) => {
          if (res.statusCode == 401) {
            login.Login().then((cookie) => {
              header = { "Authorization": cookie }
              Request(uri, method, data, header).then((res) => {
                resolve(res)
              }).catch((err) => {
                reject(err)
              })
            }).catch((err) => {
              reject(err)
            })
          } else {
            resolve(res)
          }
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    } else {
      Request(uri, method, data, header).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    }
  })
}

module.exports = {
  promiseRequest,
}