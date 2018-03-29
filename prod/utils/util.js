module.exports = {
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
  }
}
