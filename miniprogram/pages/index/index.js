// pages/index/index.js
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
    imgSrc: { 'dark': ['../../images/showPasswd_dark.png', '../../images/hidePasswd_dark.png'], 'light': ['../../images/showPasswd.png', '../../images/hidePasswd.png'] },
    imgSrcIndex: 1,
    showPasswd: false,
    theme: wx.getSystemInfoSync().theme
  },
  shPasswd: function () {
    this.setData({
      showPasswd: !this.data.showPasswd,
      imgSrcIndex: this.data.showPasswd ? 1 : 0
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
  submit: function () {
    if (!this.data.account.stuid) {
      this.showErrTips("请输入学号")
    } else if (!this.data.account.passwd) {
      this.showErrTips("请输入密码")
    } else if (!this.data.location) {
      this.showErrTips("请选择位置")
    } else {
      wx.showLoading({
        title: '正在提交'
      })
      wx.cloud.callFunction({
        name: 'storage',
        data: {
          account: this.data.account,
          location: this.data.location
        }
      }).then((res) => {
        if (res.result.status) {
          wx.navigateTo({
            url: '../success/success?stuid=' + this.data.account.stuid + '&location=' + this.data.location.name,
          })
        } else {
          this.showErrTips(res.result.message)
          wx.showToast({
            icon: 'error',
            title: '提交失败',
          })
        }
        wx.hideLoading()
      })
    }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})