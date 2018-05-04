module.exports = {
  getSetting (key, opt) {
    let { success, fail } = opt;
    wx.getSetting({
      success(res) {
        let isAuth = res.authSetting[`scope.${key}`];
        if (isAuth === undefined) { //  未授权，请求授权
          wx.authorize({
            scope: `scope.${key}`,
            success(res) { typeof success === 'function' && success(res)},
            fail(res) { typeof fail === 'function' ? fail(res) : setTimeout(_ => { wx.openSetting() }, 100) }
          })
        }
        else if (isAuth === false) { wx.openSetting(); } //  已拒绝授权，打开授权面板 
        else { typeof success === 'function' && success(res) } //  已授权，进入成功回调
      }
    });
  },
  getUserInfo (opt) {
    // let { success, fail } = opt;
    return new Promise((reslove, reject)=>{
      this.getSetting('userInfo', {
        success: _res =>{
          wx.getUserInfo({
            withCredentials: true,
            success: res => { reslove(res); },
            fail: res => { reject(res); }
          })
        },
        fail: _res => { reject(_res); }
      })
    })
  }
}