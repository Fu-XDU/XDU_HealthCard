// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
cloud.init()
const db = cloud.database().collection('data')
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
          const url = 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + event.location.latitude + ',' + event.location.longitude + '&key=AL3BZ-CR26S-TXHOD-6KE5B-VNC5H-D7BGV'
          rp(url).then(function (location) {
            location = JSON.parse(location)
            if (location.status != 0) {
              resolve({
                status: false,
                message: location.message
              })
            }
            location = location.result
            const locationJSON = {
              "address": location.address,
              "geo_api_info": {
                "type": "complete",
                "info": "SUCCESS",
                "status": 1,
                "$Da": "jsonp_106929_",
                "position": {
                  "Q": location.location.lat,
                  "R": location.location.lng,
                  "lng": location.location.lng,
                  "lat": location.location.lat
                },
                "message": "Get ipLocation success.Get address success.",
                "location_type": "ip",
                "accuracy": null,
                "isConverted": true,
                "addressComponent": {
                  //城市代码，此处提交的值和学校官方定位给出的值不同。
                  //我们提交的城市代码，是由国家码+行政区划代码（提出城市级别）组合而来，总共为9位
                  //而学校提交的城市代码，是世界各大城市所属行政区域常用电话区划号码
                  "citycode": location.ad_info.city_code,
                  "adcode": location.ad_info.adcode,
                  "businessAreas": [],
                  "neighborhoodType": "",
                  "neighborhood": "",
                  "building": "",
                  "buildingType": "",
                  "street": location.address_component.street,
                  "streetNumber": location.address_component.street_number,
                  "country": location.address_component.nation,
                  "province": location.address_component.province,
                  "city": location.address_component.city,
                  "district": location.address_component.district,
                  "township": location.address_component.street
                },
                "formattedAddress": location.formatted_addresses.recommend,
                "roads": [],
                "crosses": [],
                "pois": []
              },
              "area": location.address_component.province + " " + location.address_component.city + " " + location.address_component.district,
              "province": location.address_component.province,
              "city": location.address_component.city
            }
            db.add({
              data: {
                location: locationJSON,
                account: event.account,
                openid: wxContext.OPENID
              }
            }).then(res => {
              resolve({
                status: true,
                message: res
              })
            })
          }).catch(function (err) {
            resolve({
              status: false,
              message: err
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