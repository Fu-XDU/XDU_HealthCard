// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection(event.type == 0 ? 'data' : '3CheckData').where({
    openid: wxContext.OPENID
  }).remove()
}