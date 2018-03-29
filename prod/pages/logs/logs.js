//logs.js
let app = getApp();
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return app.util.formatTime(new Date(log))
      })
    })
  }
})
