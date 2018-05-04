let myValidate = require('./myValidate.js');
let validDec = require('./validDec.js');
let chosenList = ['radio', 'checkbox', 'picker']

module.exports = {
  _focusHandler(e) { let { name } = e.currentTarget.dataset; this.setData({ [`${name}.state.onfocus`]: true, [`${name}.state.active`]: true }) },
  _inputHandler(e) {
    let { rule, name, valid } = e.currentTarget.dataset, val = e.detail.value, model = this.data[name],
      setting = { [`${name}.active`]: !!e.detail.value }, method = !!model.method && model.method.input;
    model.value = val;
    console.log(method)
    if (model.valid === 'input') { this._validate(model, setting, (val, hasErr) => { !!method && this[method](hasErr, model); }) }
    else { !!method && typeof this[method] === 'function' ? this[method](model) : null; }
  },
  _blurHandler(e) {
    let { rule, name } = e.currentTarget.dataset, val = e.detail.value, model = this.data[name],
      setting = { [`${name}.state.active`]: !!e.detail.value, [`${name}.state.onfocus`]: false };
    if (val === '') { setting[`${name}.value`] = '' }
    if (model.valid === 'blur') { this._validate(model, setting); } else { this.setData(setting); }
  },
  _onChosenItem(e) {
    let { name, index } = e.target.dataset, model = this.data[name], { data, keyMap } = model;
    if (model.type === 'radio') {
      this.setData({
        [`${name}.data.index`]: data.index === index ? null : index,
        [`${name}.value`]: data.index === index ? null : model.list[index][keyMap.value]
      });
    }
    if (model.type === 'checkbox') {
      let item_num = data.index.indexOf(index), valueList = [];
      item_num > -1 ? data.index.splice(item_num, 1) : data.index.push(index);
      console.log('data.index------>', data.index)
      model.list.forEach((_itm, _idx) => {
        let _case = data.index.indexOf(_idx) > -1; _itm.checked = _case;
        if (_case) { valueList.push(_itm[keyMap.value]) }
      });
      this.setData({ [`${name}.list`]: model.list, [`${name}.value`]: valueList.join(',') });
    }
    if (model.required) { this._validate(model); }
  },
  _onPickerChange(e) {
    let { name } = e.currentTarget.dataset, index = e.detail.value, model = this.data[name], { list, method, keyMap } = model;
    this.setData({ [`${name}.data.index`]: index });
    if (model.required) { model.value = list[index][keyMap.value]; this._validate(model); }
    !!method && typeof this[method.change] === 'function' && this[method.change](list[index], model);
  },
  _onMutiPickerChange (e) {
    console.log('_onMutiPickerChange.event------------->', e)
  },
  _onMutiPickerColumnChange (e) {
    let { name } = e.currentTarget.dataset, model = this.data[name], setting = {},
        { column, value } = e.detail, { list, data, keyMap, source } = model;
    if (value > 0) {
      var code = list[column][value][keyMap.value];
      data.index.splice(column, 1, value);
      data.temp.splice(column, 1, source[column][value] );
      if (column + 1 < list.length) {
        setting[`${name}.list[${column + 1}]`] = [{ name: '请选择', id: null }, ...source[column + 1][code]];
        for (let i = column + 2; i < list.length; i++) {
          setting[`${name}.list[${i}]`] = [{ name: '请选择', id: null }];
          data.index.splice(i, 1, 0);
          data.temp.splice(column, 1, null);
        }
      }
    } else {
      if (column + 1 < list.length) {
        data.index.splice(column, 1, 0);
        data.temp.splice(column, 1, null);
        for (let i = column + 1; i < list.length; i++) {
          setting[`${name}.list[${i}]`] = [{ name: '请选择', id: null }];
          data.index.splice(i, 1, 0);
          data.temp.splice(i, 1, null);
        }
      }
    }
    setting[`${name}.data`] = data;
    this.setData(setting);
    model.method && typeof this[model.method['onColumnChange']] === 'function' && this[model.method['onColumnChange']](e.detail, model);
  },
  _resetMutiPicker(model) {
    let setting = {}, { list, data, keyMap, name, source } = model;
    data.index.splice(0, 1, 0);
    data.temp.splice(0, 1, 0);
    for (let i = 1; i < list.length; i++) {
      // console.log('_resetMutiPicker------------------>', i);
      setting[`${name}.list[${i}]`] = [{ name: '请选择', id: null }];
      data.index.splice(i, 1, 0);
      data.temp.splice(i, 1, 0);
    }
    setting[`${name}.data`] = data;
    this.setData(setting);
  },
  _validate(model, setting, callback) {
    let { name, value, rule, required } = model;
    setting = setting || {}; rule = required ? 'required' : rule;
    let lang = this.data.language || 'ZH_CN', ruleList = rule.split('|');
    for (let i = 0; i < ruleList.length; i++) {
      let rule_unit = ruleList[i].split(':'), [rule_name, rule_param] = rule_unit, rst = myValidate[rule_name](value, rule_param);
      if (!rst) {
        let msg = validDec[lang][rule_name];
        setting[`${name}.error`] = typeof msg === 'function' ? msg(rule_param) : msg;
        break;
      } else { setting[`${name}.error`] = '' }
    }
    this.setData(setting);
    typeof callback === 'function' ? callback(value, !!setting[`${name}.error`]) : null;
  },
  _validateAll(obj) {
    let list = [];
    for (let key in obj) {
      let model = obj[key];
      if (model.required) { this._validate(model, {}, (val, hasErr) => { list.push(hasErr); }); }
      else { this._validate(model, {}, (val, hasErr) => { list.push(hasErr); }); }
    }
    return list.indexOf(true) > -1;
  },
  _formSubmit(e) {
    let { submit } = this.data, fn = this[submit.method.submit], req = e.detail.value, validObj = {}, isValid;
    console.log('_formSubmit------------>', req)
    for (let k in req) {
      let model = this.data[k] || {};
      if (model.rule || model.required) { model.value = req[k]; validObj[k] = model; if (!isValid) { isValid = true; } }
    }
    console.log('validObj------------------------>', validObj);
    if (isValid) { submit.state.hasErr = this._validateAll(validObj) }
    typeof fn === 'function' && fn(req, submit, e);
  },
  _resetForm(e) {
    let self = this, { keys } = e.currentTarget.dataset, setting = {};
    keys.forEach((itm, idx) => {
      let model = this.data[`${itm}`];
      if (model.type === 'checkbox') {
        setting[`${itm}.data`] = { index: [] };
        model.list.forEach(_itm => { delete _itm.checked });
        setting[`${itm}.list`] = model.list;
      }
      if (model.type === 'radio') { setting[`${itm}.data`] = { index: null } }
      if (model.type === 'picker') { setting[`${itm}.data`] = { index: 0 } }
      if (model.type === 'multiPicker') { self._resetMutiPicker(model) }
      setting[`${itm}.value`] = '';
      setting[`${itm}.error`] = '';
      this.setData(setting);
    });
  }
};