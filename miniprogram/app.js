// app.js
require('./libs/Mixins.js');

const themeListeners = [];

App({
  globalData: {
    theme: 'light', // dark
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
    }
  },
  onShow() {
    this.themeChanged(wx.getSystemInfoSync().theme)
  },
  themeChanged(theme) {
    this.globalData.theme = theme;
    themeListeners.forEach((listener) => {
      listener(theme);
    });
  },
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener);
    }
  },
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener);
    if (index > -1) {
      themeListeners.splice(index, 1);
    }
  },
  onThemeChange(theme) {
    this.themeChanged(theme.theme)
  },
});
