// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const login = function () {
    const loginURL = "https://xxcapp.xidian.edu.cn/uc/wap/login/check"
    const header = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Referer': 'https://xxcapp.xidian.edu.cn/uc/wap/login?redirect=https%3A%2F%2Fxxcapp.xidian.edu.cn%2Fsite%2Fncov%2Fxidiandailyup',
      'Origin': 'https://xxcapp.xidian.edu.cn',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15',
      'X-Requested-With': 'XMLHttpRequest',
    }
    const data = {
      'MIME类型': 'application/json; charset=UTF-8',
      'username': event.account.stuid,
      'password': event.account.passwd
    }
    const options = {
      method: 'POST',
      uri: loginURL,
      form: data,
      headers: header,
      resolveWithFullResponse: true
    }
    return new Promise((resolve, reject) => {
      rp(options)
        .then(function (response) {
          body = JSON.parse(response.body)
          if (body.e != 0) {
            resolve({ loginStatus: false, message: body.m })
          } else {
            const cookieList = response.headers['set-cookie']
            var cookies = ''
            for (let i = 0; i < cookieList.length; i++) {
              cookies += cookieList[i].split(";")[0] + ";"
            }
            resolve({ loginStatus: true, message: cookies })
          }
        })
        .catch(function (err) {
          resolve({ loginStatus: false, message: err })
        });
    })
  }
  const locationData = {
    '西电南校区': {
      'MIME类型': 'application/json; charset=UTF-8',
      'sfzx': '1',  // 是否在校 是
      'tw': '1',  // 体温 36-36.5
      'area': '陕西省 西安市 长安区',
      'city': '西安市',
      'province': '陕西省',
      'address': '陕西省西安市长安区郭杜街道雷甘路西安电子科技大学长安校区',
      'geo_api_info': '{"type": "complete","position": {"Q": 34.130520019532, "R": 108.83373643663197, "lng": 108.833736, "lat": 34.13052},"location_type": "html5","message": "Get ipLocation failed.Get geolocation success.Convert Success.Get address success.","accuracy": 165, "isConverted": true, "status": 1,"addressComponent": {"citycode": "029", "adcode": "610116", "businessAreas": [],"neighborhoodType": "", "neighborhood": "", "building": "","buildingType": "", "street": "海棠二路", "streetNumber": "252号","country": "中国", "province": "陕西省", "city": "西安市", "district": "长安区","township": "郭杜街道"}, "formattedAddress": "陕西省西安市长安区郭杜街道雷甘路西安电子科技大学长安校区","roads": [], "crosses": [], "pois": [], "info": "SUCCESS"}',
      'sfcyglq': '0',  // 是否处于隔离期 否
      'sfyzz': '0',  // 是否出现发力干咳呼吸困难等症状 否
      'qtqk': '',  // 其他情况 不填
      'ymtys': '0'  //一码通颜色 绿
    }, '西电北校区': {
      'MIME类型': 'application/json; charset=UTF-8',
      'sfzx': '1',  // 是否在校 是
      'tw': '1',  // 体温 36-36.5
      'area': '陕西省 西安市 雁塔区',
      'city': '西安市',
      'province': '陕西省',
      'address': '陕西省西安市雁塔区白沙路9号西安电子科技大学北校区',
      'geo_api_info': '{"type": "complete","position": {"Q": 34.232548, "R": 108.914364, "lng": 108.914364, "lat": 34.232548},"location_type": "html5","message": "Get ipLocation failed.Get geolocation success.Convert Success.Get address success.","accuracy": 165, "isConverted": true, "status": 1,"addressComponent": {"citycode": "029", "adcode": "610116", "businessAreas": [],"neighborhoodType": "", "neighborhood": "", "building": "","buildingType": "", "street": "白沙路", "streetNumber": "9号","country": "中国", "province": "陕西省", "city": "西安市", "district": "雁塔区","township": "白沙路9号"}, "formattedAddress": "陕西省西安市雁塔区白沙路9号西安电子科技大学北校区","roads": [], "crosses": [], "pois": [], "info": "SUCCESS"}',
      'sfcyglq': '0',  // 是否处于隔离期 否
      'sfyzz': '0',  // 是否出现发力干咳呼吸困难等症状 否
      'qtqk': '',  // 其他情况 不填
      'ymtys': '0'  //一码通颜色 绿
    }
  }
  const submit = function (cookies, location) {
    const submitURL = "https://xxcapp.xidian.edu.cn/xisuncov/wap/open-report/save"
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-cn',
      //'Accept-Encoding': 'gzip, deflate, br',//这一行要注释掉，不然响应结果body前后有乱码
      'Host': 'xxcapp.xidian.edu.cn',
      'Origin': 'https://xxcapp.xidian.edu.cn',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15',
      'Connection': 'keep-alive',
      'Referer': 'https://xxcapp.xidian.edu.cn/site/ncov/xidiandailyup',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Length': '1858',
      'Cookie': cookies,
    }
    const data = locationData[location]
    const options = {
      method: 'POST',
      uri: submitURL,
      form: data,
      headers: headers,
      //resolveWithFullResponse: true
    }
    return new Promise((resolve, reject) => {
      rp(options)
        .then(function (body) {
          body = JSON.parse(body)
          var res = { username: event.account.stuid, loginStatus: true, submitStatus: body.e == 0, message: body.m }
          console.log(res)
          resolve(res)
        })
        .catch(function (err) {
          var res = { username: event.account.stuid, loginStatus: true, submitStatus: false, message: err }
          console.log(res)
          resolve(res)
        });
    })
  }
  var loginStatus = await login()
  if (!loginStatus.loginStatus || !!event.onlyLogin) {
    return loginStatus
  }
  return await submit(loginStatus.message, event.location)
}