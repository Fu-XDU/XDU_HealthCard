// app.js
require('./libs/Mixins.js');

const themeListeners = [];
const login = require("./utils/login")
App({
  globalData: {
    theme: 'light', // dark
  },
  onLaunch: function () {
    login.AuthHeader().then((res) => {
    }).catch((err) => {
    })
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
