// pages/success/success.js
Page({
  mixins: [require('../../mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    stuid: '',
    location: '',
    data: [{ key: '学号', value: '' }, { key: '位置', value: '' }, { key: '所在地点', value: '中国大陆' }, { key: '今日是否在校', value: '否' }, { key: '今日是否在中高风险地区', value: '否' }, { key: '今日体温范围', value: '36.5℃~36.9℃' }, { key: '今日是否出现发热等症状', value: '否' }, { key: '今日是否接触风险人群', value: '否' }, { key: '今日是否接触密接人员', value: '否' }, { key: '今日是否接触境外人员', value: '否' }, { key: '是否有任何与疫情相关的情况', value: '否' }],
    isWaring: false,
    errTips: '错误提示',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.data[0].value = options.stuid
    this.data.data[1].value = options.location
    this.setData({
      data: this.data.data,
      isService: options.service == "true"
    })
  },
  home: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  show: function () {
    this.setData({
      dialog: true
    })
  },
  close: function () {
    this.setData({
      dialog: false
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
  delete: function () {
    var _this = this
    this.close()
    wx.showLoading({
      title: '正在关闭',
    })
    wx.cloud.callFunction({
      name: 'delete'
    }).then((res) => {
      wx.hideLoading()
      if (res.result.stats.removed > 0) {
        wx.showModal({
          title: '提示',
          content: '关闭成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              _this.home()
            }
          }
        })
      } else { _this.showErrTips("关闭失败") }
    })
  }
})