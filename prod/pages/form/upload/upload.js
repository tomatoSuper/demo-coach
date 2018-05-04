Page({
  data: {
    canvas: { id: 'my-canvas', width: 375, height: 667, ctxTop: 0 },
    imageUrl: 'http://10.88.77.164:8000/CyB8DTe2Ds.jpg',
    QR: 'https://i.sso.sina.com.cn/images/login/td.png',
  },

  onLoad: function (options) {
    let
      { canvas, imageUrl, QR } = this.data,
      ctx = wx.createCanvasContext(canvas.id);
    
    wx.getImageInfo({
      src: imageUrl,
      success: res=>{
        console.log('wx.getImageInfo-------------->', res.path, res)
        
        ctx.drawImage(res.path, 10, 20, 200, 200);
        wx.getImageInfo({
          src: QR,
          success: _res => {
            console.log('wx.getImageInfo-------------->', _res.path, _res)
            ctx.drawImage(_res.path, 230, 20, 80, 80);
            ctx.draw();
          }
        })
      }
    })
  },
  imageOnload (e) {
    console.log('imageOnload-------------->', e)
    
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
})