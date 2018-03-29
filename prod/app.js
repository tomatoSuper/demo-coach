//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // globalData 定义全局对象
  globalData: {
    userInfo: null,
    navList: [
      { title: 'BZ主页', path: '/BZ/pages/index/index?id=BZ888&name=Nike运动鞋' },
      { title: 'Teein主页', path: '/Teein/pages/index/index?key=Teein999&value=客服管理' },
    ]
  },
  util: require('./utils/util.js'), // 定义引用工具方法库
  api: require('/config/api/index.js'), // 定义引用服务器接口配置
  // 宝尊团队使用的相关方法库
  BZ: {
    r_data: require('./utils/BZ/random_data.js') // 示例：定义和引用 创建随机数据方法库
  },
  // Teein团队使用的相关方法库
  Teein: {},
  // 可以继续扩展任意其他 全局对象 和 方法库
})