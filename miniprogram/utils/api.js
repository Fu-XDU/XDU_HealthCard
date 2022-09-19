const apiUrl = 'http://127.0.0.1:1423'
const version = 'v1'
const http = require('./http')

const login = code => {
  return http.promiseRequest("/" + version + "/auth/login", "POST", { "code": code }, false)
}

const summary = () => {
  return http.promiseRequest("/" + version + "/serve/summary", "GET", {}, true)
}

const submitThreeCheck = data => {
  return http.promiseRequest("/" + version + "/serve/three-check", "POST", data, true)
}

const submitHealthCard = data => {
  return http.promiseRequest("/" + version + "/serve/health-card", "POST", data, true)
}

const deleteThreeCheck = () => {
  return http.promiseRequest("/" + version + "/serve/three-check", "DELETE", {}, true)
}

const deleteHealthCard = () => {
  return http.promiseRequest("/" + version + "/serve/health-card", "DELETE", {}, true)
}

const handleApiError = code => {
  let errTitle = "未知错误"
  switch (code) {
    case -1:
      errTitle = "未能连接至服务器"
      break
    case 30007:
      errTitle = "登录失败！"
      break
  }
  return errTitle
}

export {
  apiUrl,
  version,
  login,
  summary,
  submitThreeCheck,
  submitHealthCard,
  deleteThreeCheck,
  deleteHealthCard,
  handleApiError
}