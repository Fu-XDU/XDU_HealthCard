// pages/threeChecks/threeChecks.js
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
    imgSrcIndex: 1,
    showPasswd: false,
    theme: wx.getSystemInfoSync().theme,
    dialog: false,
    buttonStyle: 'weui-btn_primary',
    buttonText: '提交'
  },
  shPasswd: function () {
    this.setData({
      showPasswd: !this.data.showPasswd,
      imgSrcIndex: this.data.showPasswd ? 1 : 0
    })
  },
  isRegistered: function () {
    wx.cloud.callFunction({
      name: 'isRegistered',
      data: {
        type: 1
      }
    }).then((res) => {

      if (res.result.data.length != 0) {
        this.setData({
          buttonStyle: 'weui-btn_default',
          buttonText: '我的项目',
          myService: res.result.data[0]
        })
      }
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
        url: '../success/success?service=true&type=1&stuid=' + this.data.myService.account.stuid + '&location=' + this.data.myService.location
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
    this.close()
    if (this.checkPara()) {
      wx.showLoading({
        title: '正在提交'
      })
      wx.cloud.callFunction({
        name: 'submit',
        data: {
          account: this.data.account,
          onlyLogin: true
        }
      }).then((res) => {
        if (res.result.loginStatus) {
          wx.cloud.callFunction({
            name: 'storage3Checks',
            data: {
              account: this.data.account,
              location: this.data.location
            }
          }).then((res) => {
            if (res.result.status) {
              wx.navigateTo({
                url: '../success/success?service=false&type=1&stuid=' + this.data.account.stuid + '&location=' + this.data.location,
              })
            } else {
              console.error(res)
              this.showErrTips(res.result.message)
              wx.showToast({
                icon: 'error',
                title: '提交失败',
              })
            }
            wx.hideLoading()
          })
        } else {
          this.showErrTips(res.result.message)
          wx.showToast({
            icon: 'error',
            title: '提交失败',
          })
        }
        wx.hideLoading()
      }).catch((err) => {
        console.error(err)
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
    wx.reLaunch({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    this.isRegistered()
    wx.onThemeChange(function () {
      _this.setData({
        theme: wx.getSystemInfoSync().theme
      })
    })
  }
})