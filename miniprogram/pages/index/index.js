// pages/index/index.js
// 疫情通（健康卡）页面
const api = require('../../utils/api')
Page({
  mixins: [require('../../mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    account: { 'stuid': '', 'passwd': '' },
    location: '',
    isWaring: false,
    errTips: '错误提示',
    timeoutID: 0,
    // imgSrc: { 'dark': ['../../images/showPasswd_dark.png', '../../images/hidePasswd_dark.png'], 'light': ['../../images/showPasswd.png', '../../images/hidePasswd.png'] },
    // imgSrcIndex: 1,
    // showPasswd: false,
    theme: wx.getSystemInfoSync().theme,
    dialog: false,
    buttonStyle: 'weui-btn_primary',
    buttonText: '提交'
  },

  /*
  shPasswd: function () {
    this.setData({
      showPasswd: !this.data.showPasswd,
      imgSrcIndex: this.data.showPasswd ? 1 : 0
    })
  },
  */

  isRegistered: function () {
    var _this = this
    api.summary().then((res) => {
      console.log(res)
      if (res.data.code == 0) {
        if (res.data.data.health_card.id != 0) {
          res.data.data.health_card.location = JSON.parse(res.data.data.health_card.location)
          this.setData({
            buttonStyle: 'weui-btn_default',
            buttonText: '我的项目',
            myService: res.data.data.health_card
          })
        } else {
          this.setData({
            buttonStyle: 'weui-btn_primary',
            buttonText: '提交',
            myService: null
          })
        }
      } else {
        _this.showErrTips(api.handleApiError(res.data?.code))
      }
    }).catch((err) => {
      _this.showErrTips(api.handleApiError(err.errMsg == "request:fail " ? -1 : err.data?.code))
    })
  },

  locate: function () {
    var _this = this
    const getLocation = function () {
      wx.chooseLocation().then((res) => {
        if (!res.address || !res.name) {
          wx.showModal({
            title: '错误',
            content: '没有选择地点'
          })
        } else {
          _this.setData({
            location: res
          })
        }
      }).catch((err) => { })
    }
    wx.authorize({
      scope: 'scope.userLocation',//发起定位授权
      success: function () {
        getLocation()
        //授权成功，此处调用获取定位函数
      }, fail() {
        //如果用户拒绝授权，则要告诉用户不授权就不能使用，引导用户前往设置页面。
        console.error('没有定位授权')
        wx.showModal({
          cancelColor: 'cancelColor',
          title: '没有授权无法获取位置信息',
          content: '是否前往设置页面手动开启',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                withSubscriptions: true,
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: '您取消了定位授权',
              })
            }
          }, fail: function (e) {
            console.log(e)
          }
        })
      }
    })
  },

  handleInput: function (data) {
    const name = data.target.dataset.name
    const value = data.detail.value
    this.data.account[name] = value
    this.setData({
      account: this.data.account
    })
  },

  showErrTips: function (tips) {
    clearTimeout(this.data.timeoutID)
    this.setData({
      isWaring: true,
      errTips: tips
    })
    var _this = this
    this.data.timeoutID = setTimeout(function () {
      _this.setData({
        isWaring: false
      })
    }, 2500);
  },

  close: function () {
    this.setData({
      dialog: false
    })
  },

  show: function () {
    if (!this.data.myService) {
      if (this.checkPara()) {
        this.setData({
          dialog: true
        })
      }
    } else {
      wx.navigateTo({
        url: '../success/success?service=true&type=0&stuid=' + this.data.myService.stu_id + '&location=' + this.data.myService.location.geo_api_info.formattedAddress
      })
    }
  },

  checkPara: function () {
    if (!this.data.account.stuid) {
      this.showErrTips("请输入学号")
    } else if (!this.data.account.passwd) {
      this.showErrTips("请输入密码")
    } else if (!this.data.location) {
      this.showErrTips("请选择位置")
    } else {
      return true
    }
    return false
  },

  submit: function () {
    var _this = this
    this.close()
    if (this.checkPara()) {
      wx.showLoading({
        title: '正在提交'
      })
      let body = {
        stu_id: this.data.account.stuid,
        passwd: this.data.account.passwd,
        latitude: this.data.location.latitude,
        longitude: this.data.location.longitude,
      }
      api.submitHealthCard(body).then((res) => {
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '../success/success?service=false&type=0&stuid=' + this.data.account.stuid + '&location=' + this.data.location.name,
          })
          this.setData({
            account: { 'stuid': '', 'passwd': '' },
            location: ''
          })
        } else {
          _this.showErrTips(res.data.error)
        }
        wx.hideLoading()
      }).catch((err) => {
        _this.showErrTips("提交失败")
        wx.hideLoading()
      })
    }
  },

  toGuide: function () {
    wx.navigateTo({
      url: '../guide/guide',
    })
  },

  /*
  to3Checks: function () {
    wx.reLaunch({
      url: '../threeChecks/threeChecks',
    })
  },
  */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.onThemeChange(function () {
      _this.setData({
        theme: wx.getSystemInfoSync().theme
      })
    })
  },

  onShow: function (options) {
    this.isRegistered()
  },
})