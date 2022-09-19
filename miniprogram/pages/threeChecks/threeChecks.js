// pages/threeChecks/threeChecks.js
const api = require('../../utils/api')
Page({
  mixins: [require('../../mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    account: { 'stuid': '', 'passwd': '' },
    locations: ['西电南校区', '西电北校区'],
    locationIndex: -1,
    isWaring: false,
    errTips: '错误提示',
    timeoutID: 0,
    imgSrc: { 'dark': ['../../images/showPasswd_dark.png', '../../images/hidePasswd_dark.png'], 'light': ['../../images/showPasswd.png', '../../images/hidePasswd.png'] },
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
        if (res.data.data.three_check.id != 0) {
          this.setData({
            buttonStyle: 'weui-btn_default',
            buttonText: '我的项目',
            myService: res.data.data.three_check
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

  bindPickerChange: function (e) {
    this.setData({
      locationIndex: e.detail.value
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
        url: '../success/success?service=true&type=1&stuid=' + this.data.myService.stu_id + '&location=' + this.data.myService.location
      })
    }
  },

  checkPara: function () {
    if (!this.data.account.stuid) {
      this.showErrTips("请输入学号")
    } else if (!this.data.account.passwd) {
      this.showErrTips("请输入密码")
    } else if (this.data.locationIndex == -1) {
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
        location: this.data.locations[this.data.locationIndex]
      }
      api.submitThreeCheck(body).then((res) => {
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '../success/success?service=false&type=1&stuid=' + this.data.account.stuid + '&location=' + this.data.locations[this.data.locationIndex],
          })
          this.setData({
            account: { 'stuid': '', 'passwd': '' },
            locationIndex: -1,
          })
        } else {
          // wx.showToast({
          //   icon: 'error',
          //   title: '提交失败',
          // })
          _this.showErrTips(res.data.error)
        }
        wx.hideLoading()
      }).catch((err) => {
        // wx.showToast({
        //   icon: 'error',
        //   title: '提交失败',
        // })
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

  toIndex: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },

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