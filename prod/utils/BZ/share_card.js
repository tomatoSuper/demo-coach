module.exports = {
  // 构造函数， 输出 画布内容的 元数据模型
  _ShareCardSetting(image, title, panel, logo, QR_codePath) {
    let paddingX = 31; // 定义 文本 的左右边距

    this.image = { padding: [41, 28, 0] };  // 定义 详情图片 的路径 和 左右边距
    Object.assign(this.image, image)

    this.title = { text: title, fontSize: 17, padding: [21, paddingX, 20] }; // 定义 卡片标题 的 文本信息 和 左右边距

    this.panel = {
      // 定义 面板标题 的 文本信息、字体样式 和 左右边距
      title: { text: panel.title, fontSize: 15, font: 'normal bold 15px SourceHanSansCN-Regular microsoftYahei', padding: [20, paddingX, 16] },
      list: []
    };

    // 定义 面板内容 的 文本信息、字体样式 和 左右边距
    panel.list.forEach((_itm, _idx) => {
      let _setting = { text: _itm, fontSize: 14, padding: [5, paddingX, 6] };
      if (_idx === 0) { _setting.font = 'normal 14px normal'; }
      this.panel.list.push(_setting);
    });

    // 定义 卡片logo 的 图片路径、尺寸 和 左右边距
    this.logo = { path: logo, width: 135, padding: [18, paddingX] };
    this.logo.height = 135 / 3;

    // 定义 卡片二维码 的 图片路径、尺寸 和 左右边距
    this.QR_code = { path: QR_codePath, width: 77, height: 77, padding: [5, paddingX] };
  },

  _createShareCardImage(opt) {
    let { model, canvas, success, fileType } = opt, 
        canvasWidth = canvas.width, ctx = wx.createCanvasContext(canvas.id),
        setting = new this._ShareCardSetting(...model),
        { image, title, panel, QR_code, logo } = setting;

    ctx.setFillStyle('#e6e6e6');
    ctx.fillRect(0, canvas.ctxTop, canvasWidth, canvas.height - canvas.ctxTop);
    // 绘制 详情信息图片
    console.log('image.imageUrl---------->', image.imageUrl, image)
    canvas.ctxTop = image.padding[0]; canvas.ctx = ctx;
    let _image_width = canvasWidth - this._calcPadding(image.padding), _image_height = _image_width / image.scale;
    ctx.drawImage(image.imageUrl, image.padding[1], canvas.ctxTop, _image_width, _image_height);

    canvas.ctxTop += _image_height; // 更新画笔上下文位置
    ctx.setTextAlign('left'); // 设置文本样式
    ctx.setFillStyle('#000000');
    this._renderText(canvas, title); // 绘制 标题

    // 绘制 白色面板
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, canvas.ctxTop, canvasWidth, canvas.height - canvas.ctxTop);

    ctx.setFillStyle('#000000');
    this._renderText(canvas, panel.title); // 绘制 面板上的 标题
    panel.list.forEach(itm => { this._renderText(canvas, itm) }); // 循环 绘制 面板上的 其他键值对信息
    let _sub_model = panel.list[panel.list.length - 1];
    canvas.ctxTop += _sub_model.padding[2] ? _sub_model.padding[2] : _sub_model.padding[0]; // 更新画笔上下文位置

    canvas.ctxTop += QR_code.padding[0];
    ctx.drawImage(QR_code.path, canvasWidth - QR_code.padding[1] - QR_code.width, canvas.ctxTop, QR_code.width, QR_code.height); // 绘制 二维码

    canvas.ctxTop += logo.padding[0];
    ctx.drawImage(logo.path, logo.padding[1], canvas.ctxTop, logo.width, logo.height); // 绘制 logo

    // canvas 绘制完成后，输出图片 
    ctx.draw(true, _ => {
      wx.canvasToTempFilePath({
        canvasId: canvas.id,
        fileType: fileType || 'jpg',
        success: res => {   typeof success === 'function' && success(res) }
      });

    });
  },
  _calcPadding(padding, direction) {
    direction = direction || 'x';
    if (direction === 'x') { return (padding[3] ? padding[1] + padding[3] : 2 * padding[1]) }
    else { return (padding[2] ? padding[0] + padding[2] : 2 * padding[0]) }
  },
  _renderText(canvas, model, flag) {
    // 先设置字体
    if (model.fontSize) { canvas.ctx.setFontSize(model.fontSize) }
    if (model.font) { canvas.ctx.font = model.font };
    canvas.ctxTop += model.padding[0] + model.fontSize; // 更新画笔上下文位置，添加 文本的 padding-top
    canvas.ctx.fillText(model.text, model.padding[1], canvas.ctxTop); // 绘制文本
    canvas.ctxTop += model.padding[2] ? model.padding[2] : model.padding[0]; // 更新画笔上下文位置，添加 文本的 padding-bottom
  }
}