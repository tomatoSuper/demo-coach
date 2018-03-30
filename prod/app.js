//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    let self = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getSystemInfo();
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              let setting = { id: 'userId', unionId: 'myUnionId', openId: 'myOpenId'}
              Object.assign(this.globalData, setting);
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getSystemInfo() {
    let self = this;
    wx.getSystemInfo({
      success(res) { self.globalData.systemInfo = res; }
    })
  },
  globalData: {
    userInfo: null,
    //公众号的openid
    openId: '',
    //小程序unionid
    unionId:''
  },
  BZ: {
    globalData: {},
    r_data: require('./utils/BZ/random_data.js'),
    obj1: null,
    obj2: null,
    obj3: null,
  },
  Teein: {
    globalData: {},
    obj1: null,
    obj2: null,
    obj3: null,
  },
  api: require('./config/api/index.js'),
  util: require('./utils/util.js')
})