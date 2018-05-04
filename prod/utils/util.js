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
  formatTime(_date, param, lang) {
    lang = lang || '-'
    const year = _date.getFullYear()
    const month = _date.getMonth() + 1
    const date = _date.getDate()
    const day = _date.getDay()
    const hour = _date.getHours()
    const minute = _date.getMinutes()
    const second = _date.getSeconds()
    const ms = _date.getMilliseconds()
    const long = _date.getTime()
    
    let formatNumber = this.formatNumber;
    let d = [year, month, date].map(formatNumber);
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
      case 'json': rst = { year, month, date, day, hour, minute, second, ms, long };
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
  isFunction(target) { return typeof target === 'function' },
  isArray(target) { return target instanceof Array  },
  isPlainObject(target) { return Object.toLocaleString.call(target) === "[object Object]" },
  extend () {
    // target被扩展的对象 length参数的数量 deep是否深度操作
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
      // target为第一个参数，如果第一个参数是Boolean类型的值，则把target赋值给deep
    　// deep表示是否进行深层面的复制，当为true时，进行深度复制，否则只进行第一层扩展
    　// 然后把第二个参数赋值给target
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;  // 将i赋值为2，跳过前两个参数
      }
      // target既不是对象也不是函数则把target设置为空对象。
      if (typeof target !== "object" && !this.isFunction(target)) { target = {}; }
      // 如果只有一个参数，则把jQuery对象赋值给target，即扩展到jQuery对象上
      if (length === i) {
        target = this; // i减1，指向被扩展对象
        --i;
      }
      // 开始遍历需要被扩展到target上的参数
      for (; i < length; i++) {
        // 处理第i个被扩展的对象，即除去deep和target之外的对象
        if ((options = arguments[i]) != null) {
          // 遍历第i个对象的所有可遍历的属性
          for (name in options) {
            // 根据被扩展对象的键获得目标对象相应值，并赋值给src
            src = target[name];
            // 得到被扩展对象的值
            copy = options[name];
            // 这里为什么是比较target和copy？不应该是比较src和copy吗？
            if (target === copy) {
              continue;
            }
            // 当用户想要深度操作时，递归合并
            // copy是纯对象或者是数组
            if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
              // 如果是数组
              if (copyIsArray) {
                copyIsArray = false; // 将copyIsArray重新设置为false，为下次遍历做准备。
                clone = src && this.isArray(src) ? src : [];  // 判断被扩展的对象中src是不是数组
              } else {
                clone = src && this.isPlainObject(src) ? src : {}; // 判断被扩展的对象中src是不是纯对象
              }
              target[name] = this.extend(deep, clone, copy); // 递归调用extend方法，继续进行深度遍历

              // 如果不需要深度复制，则直接把copy（第i个被扩展对象中被遍历的那个键的值）
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
    　　// 原对象被改变，因此如果不想改变原对象，target可传入{}
    　　return target;
  },
  // 封装倒计时方法
  setCounting(page, key, model, count = 60) {
    console.log(`${key}.text`);
    page.setData({ [`${key}.text`]: `${count}s`, [`${key}.active`]: true })
    let timer = setInterval(_ => {
      if (count === 0) { clearInterval(timer); page.setData({ [`${key}.text`]: model.placeholder, [`${key}.active`]: false }); }
      else { console.log('111111111'); count--; page.setData({ [`${key}.text`]: `${count}s` }); }
    }, 1000);
    return timer;
  },
  getImageInfo(path) {
    return new Promise((reslove, reject) => {
      wx.getImageInfo({
        src: path,
        success: res => {
          res.path = res.path.indexOf('http') > -1 ? res.path : '/' + res.path;
          reslove(res);
        }
      })
    })
  }
}
