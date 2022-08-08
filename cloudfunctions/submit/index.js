// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init()

// 云函数入口函数
//event = { account, location, onlyLogin}
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const login = function () {
    const loginURL = "https://xxcapp.xidian.edu.cn/uc/wap/login/check"
    const header = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Referer': 'https://xxcapp.xidian.edu.cn/uc/wap/login?redirect=https%3A%2F%2Fxxcapp.xidian.edu.cn%2Fncov%2Fwap%2Fdefault%2Findex',
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

  const submit = function (cookies, location) {
    const submitURL = "https://xxcapp.xidian.edu.cn/ncov/wap/default/save"
    const headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      //'Accept-Encoding': 'gzip, deflate, br',//这一行要注释掉，不然响应结果body前后有乱码
      'Host': 'xxcapp.xidian.edu.cn',
      'Origin': 'https://xxcapp.xidian.edu.cn',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15',
      'Connection': 'keep-alive',
      'Referer': 'https://xxcapp.xidian.edu.cn/uc/wap/login?redirect=https%3A%2F%2Fxxcapp.xidian.edu.cn%2Fncov%2Fwap%2Fdefault%2Findex',
      'X-Requested-With': 'XMLHttpRequest',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Cookie': cookies,
    }
    const data = {
      'MIME类型': 'application/json; charset=UTF-8',
      'szgjcs': '',  // 所在国家城市
      'szcs': '',  // 所在城市
      'szgj': '',  // 所在国家
      'zgfxdq': '0',  // 今日是否在中高风险地区？（中高风险地区信息可通过国务院客户端小程序实时查询）
      'mjry': '0',  // 是否接触密接人员
      'csmjry': '0',  // 近14日内本人/共同居住者是否去过疫情发生场所（市场、单位、小区等）或与场所人员有过密切接触
      'tw': '2',  // 体温：第三项，36-36.5
      'sfcxtz': '0',  // 是否出现发热（37.3℃以上）、乏力、干咳、呼吸困难等任意症状之一
      'sfjcbh': '0',  // 是否接触无症状感染/疑似/确诊人群
      'sfcxzysx': '0',  // 是否有任何与疫情相关的， 值得注意的情况
      'qksm': '0',
      'sfyyjc': '0',  // 是否医院检查
      'jcjgqr': '0',  // 检查结果确认
      'remark': '',
      'address': location['address'],  // 地址
      'geo_api_info': JSON.stringify(location['geo_api_info']),// 定位系统详情
      'area': location['area'],  // 地区
      'province': location['province'],  // 省份
      'city': location['city'],  // 城市
      'sfzx': '0',  // 是否在校 否
      'sfjcwhry': '0',  // 是否接触武汉人员 否
      'sfjchbry': '0',  // 是否接触湖北人员 否
      'sfcyglq': '0',  // 是否处于隔离期 否
      'gllx': '',
      'glksrq': '',
      'jcbhlx': '',
      'jcbhrq': '',
      'ismoved': '0',  // 与上次地点是否有不同
      'bztcyy': '',
      'sftjhb': '0',  // 是否途径湖北 否
      'sftjwh': '0',  // 是否途径武汉 否
      'sfjcjwry': '0',  // 是否接触境外人员 否
      'jcjg': ''
    }
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