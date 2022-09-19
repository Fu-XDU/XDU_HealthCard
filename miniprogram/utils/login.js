const api = require('./api')
const util = require('./util.js')
const Login = () => {
  return new Promise((resolve, reject) => {
    login().then((res) => {
      if (res.data.success) {
        util.setStorage('cookie', "Bearer " + res.data.data)
        resolve("Bearer " + res.data.data)
      } else {
        reject(res)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          api.login(res.code).then((res) => {
            resolve(res)
          }).catch((err) => {
            reject(err)
          })
        } else {
          reject(res)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

const AuthHeader = function () {
  return new Promise((resolve, reject) => {
    const cookieCache = util.getStorage('cookie')
    if (!cookieCache) {
      Login().then(() => {
        resolve(util.getStorage('cookie'))
      }).catch((err) => {
        reject(err)
      })
    } else {
      resolve(cookieCache)
    }
  })
}

module.exports = {
  Login,
  AuthHeader,
}