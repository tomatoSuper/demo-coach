const util = require('./utils/util.js');
App({
  util,
  device: {},
  promise: {},
  onLaunch () {
    this.promise.device = new Promise((reslove, reject)=>{
      wx.getSystemInfo({ success: res => { Object.assign(this.device, res); reslove(this.device); } })
    })
    // 展示本地存储能力
    this.getSystemInfo();
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     this.request.doPost({
    //       url: 'https://www.easy-mock.com/mock/5a93769e6f4c043a27445e48/reebok/api/v1/member/login',
    //       success: res=> {
    //         console.log(res.data.data)
    //         available.moreWorker && self.worker.postMessage(res.data.data);
    //       }
    //     })
    //   }
    // });
    
  },
  getSystemInfo() { wx.getSystemInfo({ success: res => { this.globalData.systemInfo = res; } }) },
  globalData: {
    userInfo: null,
    //公众号的openid
    wechatId: '',
    //小程序unionid
    unionId:''
  },
  language: {
    'ZH_CN': {
      monthEnum: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      weekEnum: ['日', '一', '二', '三', '四', '五', '六']
    },
    EN: {
      monthEnum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      weekEnum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      // weekList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
  },
  BZ: {
    globalData: {},
    r_data: require('./utils/BZ/random_data.js'),
    authorize: require('/utils/BZ/authorize.js'),
    ben_form: require('./utils/BZ/ben_form.js'),
    validate: require('./utils/BZ/myValidate.js'),
    util: require('./utils/util.js'),
    validDec: require('./utils/BZ/validDec.js'),
    shareCard: require('./utils/BZ/share_card.js'),
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

  loadmore: require('./utils/loadmore.js'),
  request: require('utils/request.js')
})