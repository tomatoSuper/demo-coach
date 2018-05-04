let app = getApp();
Page({
  data: {
    canvas: { id: 'my-canvas', width: 375, height: 667, ctxTop: 0 },
    detail: {},
    promise: {},
    shareCard: { logo: '/images/coach_logo.png' }
  },
  onLoad (option) {
    let { promise } = this.data, { id } = option;
    promise.detailInfo = this.getDetailInfo(id); // 获取 详情信息
    promise.ShareCardImage = this.preloadShareCardImage(promise); // 预加载 生成分享卡片
    
    
  },
  demoDraw(path) {
    let demo_ctx = wx.createCanvasContext('demo-canvas');
    console.log('demo_ctx--------->', demo_ctx)
    demo_ctx.drawImage(path, 0, 0, 300, 300);
    demo_ctx.draw();
  },
  preloadShareCardImage(promise) {
    let _promise = new Promise((reslove, reject) => {
          promise.detailInfo.then(detail => {

            this.setData({ detail }); // 更新 详情信息 字段
            promise.Qr_code = app.util.getImageInfo(detail.QR); // 加载 详情信息的 二维码
            
            // promise.Qr_code.then(res=>{
            //   console.log('promise.Qr_code.then=--------------->', res)
            //   this.demoDraw(res.path);
            // })
            wx.getImageInfo({
              src: detail.QR,
              success: res => { console.log('wx.getImageInfo--->', res); this.demoDraw(res.path); }
            })


            // 监听 卡片的封面图片 加载完成
            // app.util.getImageInfo(detail.imageUrl).then(res => {
            //   console.log('detail.imageUrl-------------->', res);
              
            //   let { width, height, path } = res, { detail, canvas, promise, shareCard } = this.data;

            //   let image = { imageUrl: path, scale: width / height }, title = detail.name,
            //       panelData = { title: detail.price, list: [`款号：${detail.num}`, `颜色：${detail.color}`, `尺寸：${detail.size}`] };
            //   // 监听 二维码 加载完成
            //   promise.Qr_code.then(data => {
            //     let
            //       arg = [image, title, panelData, shareCard.logo, data.path],
            //       success = _res => {
            //         console.log('_createShareCardImage _res.tempFilePath -------------->',_res.tempFilePath)
            //         // this.setData({ [`shareCard.temPath`]: _res.tempFilePath }); // 更新 分享卡片的 临时路径
            //         reslove(_res.tempFilePath); // 对外抛出 分享卡片的 临时路径
            //       };
            //     app.BZ.shareCard._createShareCardImage({ model: arg, canvas, success }); // 执行画布绘制方法
            //   })
            // });

          })
        })
    return _promise;
  },
  saveShareCard (e) {
    let { promise } = this.data;
    // app.BZ.authorize.getSetting('writePhotosAlbum', {
    //   success(res) { promise.ShareCardImage.then( filePath => { wx.saveImageToPhotosAlbum({ filePath }); }) },
    //   fail(res) { }
    // })
    wx.showLoading();
    promise.ShareCardImage.then(filePath => { wx.hideLoading(); wx.previewImage({ urls: [filePath] }) });
  },
  getDetailInfo (data) {
    let QR = 'https://i.sso.sina.com.cn/images/login/td.png';
    // let QR = 'http://10.88.77.164:8000/QR_code.jpg';
    // let QR = '/images/QR_code.jpg';

    return new Promise((reslove, reject) => {
      let detail = { 
        imageUrl: 'http://10.88.77.164:8000/CyB8DTe2Ds.jpg',
        // imageUrl: '/images/CyB8DTe2Ds.jpg',
        name: 'Nokia经典款手机',
        price: '￥6,950',
        num: '31071',
        color: '黄铜色硬件/橙红色',
        size: 'onesize',
        QR
      };
      reslove(detail);
    })
  }
})