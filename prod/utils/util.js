function MyCharts(setting) {
  let self = this;
  let { id, value, range, line, size, padding, radius, ready } = setting;
  let ctx = wx.createCanvasContext(id);
  ctx.clearRect(0, 0, size.width, size.height);
  let center = [size.width / 2, size.height / 2];
  padding = !padding || padding < 1 ? 1 : padding;
  radius = radius || (center[0] > center[1] ? center[1] : center[0]) - padding;
  let numScale = value < range[1] ? value / (range[1] - range[0]) : 1;
  let arcRange = [5 / 6 * Math.PI, 1 / 6 * Math.PI];
  let arcScale = 4 / 3 * Math.PI;

  // 先画外面圆的底色
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, arcRange[0], arcRange[1]);
  ctx.setStrokeStyle('#c0c0c0');
  ctx.setLineCap('round');
  ctx.setLineWidth(1);
  ctx.stroke();

  // 画进度线的底色
  ctx.beginPath()
  radius = radius - (line.margin || 4);
  ctx.arc(center[0], center[1], radius, arcRange[0], arcRange[1]);
  ctx.setStrokeStyle(line.background || '#c0c0c0');
  ctx.setLineCap('round');
  ctx.setLineWidth(line.width || 1);
  ctx.stroke();

  ctx.draw();

  this.animation = null;
  this.ready = false;
  this.proAng = this.startAng = arcRange[0];
  this.stepAng = 0.005 * arcScale;
  // 画进度值的线
  let lineEnd = arcRange[0] + numScale * arcScale;
  self.animation = setInterval(_ => {
    ctxAnimate(ctx, self.startAng, self.proAng)
  }, 10)
  function ctxAnimate(ctx, start, end) {
    ctx.beginPath();
    ctx.setLineWidth(1)
    ctx.setLineJoin('miter')
    ctx.arc(center[0], center[1], radius, start, end);
    ctx.setStrokeStyle(line.color || '#BC1928')
    ctx.stroke()
    if (self.proAng >= lineEnd) {
      self.ready = true;
      clearInterval(self.animation);
      ctx.draw(true, _ => {
        !!self.ready && !!ready && typeof ready === 'function' && ready(ctx);
      });
    } else { ctx.draw(true); self.proAng += self.stepAng; }
  }

}

module.exports = {
  chart(setting) {
    return new MyCharts(setting);
  },
  formatTime(date, param, lang) {
    lang = lang || '-'
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const ms = date.getMilliseconds()
    let formatNumber = this.formatNumber;
    let d = [year, month, day].map(formatNumber);
    let t = [hour, minute, second].map(formatNumber)
    let rst = ''
    switch (param) {
      case undefined: rst = (lang === 'ZH_CN' ? d[0] + '年' + d[1] + '月' + d[2] + '日' : d.join(lang)) + ' ' + t.join(':'); break;
      case 'yyyy-mm-dd hh:mm:ss.S': rst = (lang === 'ZH_CN' ? d[0] + '年' + d[1] + '月' + d[2] + '日' : d.join(lang)) + ' ' + t.join(':') + ' ' + ms; break;
      case 'yyyy-mm-dd hh:mm:ss': rst = (lang === 'ZH_CN' ? d[0] + '年' + d[1] + '月' + d[2] + '日' : d.join(lang)) + ' ' + t.join(':'); break;
      case 'yyyy-mm-dd hh:mm': rst = (lang === 'ZH_CN' ? d[0] + '年' + d[1] + '月' + d[2] + '日' : d.join(lang)) + ' ' + [t[0], t[1]].join(':');
        break;
      case 'yyyy': rst = lang === 'ZH_CN' ? d[0] + '年' : d[0]; break;
      case 'yyyy-mm': rst = lang === 'ZH_CN' ? d[0] + '年' + d[1] + '月' : [d[0], d[1]].join(lang); break;
      case 'mm-dd': rst = lang === 'ZH_CN' ? d[1] + '月' + d[2] + '日' : [d[1], d[2]].join(lang); break;
      case 'mm-dd hh:mm': rst = (lang === 'ZH_CN' ? d[1] + '月' + d[2] + '日' : [d[1], d[2]].join(lang)) + ' ' + [t[0], t[1]].join(':'); break;
      case 'yyyy-mm-dd': rst = lang === 'ZH_CN' ? d[0] + '年' + d[1] + '月' + d[2] + '日' : d.join(lang); break;
      case 'hh:mm': rst = [t[0], t[1]].join(':'); break;
      case 'hh:mm:ss': rst = t.join(':'); break;
    }
    return rst
  },
  formatNumber(n) { return n < 10 ? '0' + n : n },
  toasting(title) { wx.showToast({ title, icon: 'none' }); },
  camelToKebab(obj) {
    let arr = []
    let reg = /[A-Z]/g
    for (let k in obj) {
      let _k = k.replace(reg, v => '-' + v.toLowerCase())
      arr.push(_k + ':' + obj[k]);
    }
    return arr.join(';');
  },
  ArrayToObject(arr, key) {
    let obj = {};
    arr.forEach(_itm => { obj[_itm[key]] = _itm; })
    return obj;
  },
  createQueryList(obj) {
    if (!obj) { return "" }
    let arr = []
    for (let k in obj) {
      if (obj[k]) arr.push(k + '=' + obj[k])
    }
    return arr;
  },
  createQueryString(obj) {
    let arr = this.createQueryList(obj);
    return arr.length ? "?" + arr.join("&") : "";
  },
  copyObj(source, data) {
    let obj = {};
    for (let key in data) {
      if (source[key] !== undefined) { obj[key] = data[key]; }
    }
    return obj
  },
  // 判断两个对象键值对是否相同
  isEqualObject(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) { return false; }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
        break;
      }
    }
    return true;
  },
  
}
