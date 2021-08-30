// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database().collection('3CheckData')
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const haveItem = function () {
    return new Promise((resolve, reject) => {
      db.where({
        openid: wxContext.OPENID
      }).get().then((res) => {
        resolve(res.data.length != 0)
      }).catch((err) => {
        reject(err)
      })
    })
  }
  const storage = function () {
    return new Promise((resolve, reject) => {
      haveItem().then((haveItem) => {
        if (!haveItem) {
          db.add({
            data: {
              location: event.location,
              account: event.account,
              openid: wxContext.OPENID
            }
          }).then(res => {
            resolve({
              status: true,
              message: res
            })
          })
        } else {
          resolve({
            status: false,
            message: '数据库已有此信息'
          })
        }
      }).catch(err => {
        resolve({
          status: false,
          message: err
        })
      })
    })
  }
  return await storage()
}