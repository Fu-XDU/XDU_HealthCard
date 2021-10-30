// pages/guide/guide.js
Page({
  mixins: [require('../../mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    data: [[{ key: '学号', value: '你的学号' }, { key: '位置', value: '你选择的位置' }, { key: '所在地点', value: '中国大陆' }, { key: '今日是否在校', value: '否' }, { key: '今日是否在中高风险地区', value: '否' }, { key: '今日体温范围', value: '36.5℃~36.9℃' }, { key: '今日是否出现发热等症状', value: '否' }, { key: '今日是否接触风险人群', value: '否' }, { key: '今日是否接触密接人员', value: '否' }, { key: '今日是否接触境外人员', value: '否' }, { key: '是否有任何与疫情相关的情况', value: '否' }], [{ key: '学号', value: '你的学号' }, { key: '位置', value: '你选择的位置' }, { key: '所在地点', value: '中国大陆' }, { key: '今日体温范围', value: '36℃~36.5℃' }, { key: '今日西安“一码通”颜色', value: 'A 绿色' }, { key: '是否在校', value: '是' }, { key: '是否处于隔离期', value: '否' }, { key: '是否出现乏力、干咳、呼吸困难等症状', value: '否' }]],
    githubUrl: 'https://github.com/Fu-XDU/XDU_HealthCard'
  },
  copyGithubUrl: function () {
    wx.setClipboardData({
      data: this.data.githubUrl,
      success(res) {
        wx.showToast({
          title: '已复制',
        })
      }
    })
  }
})