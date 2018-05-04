const
app = getApp(),
{ status, city, eventType, province, cities, areas} = require('./data.js');
let page_setting = {
  data: {
    local_code: {
      type: 'number', name: 'local_code', value: '', rule: 'required|mobile', placeholder: '手机号码', maxlength: 11, valid: 'input',
      state: { active: false, onfocus: false, collapse: false },
      method: { input: 'local_code_input', focus: '', blur: '' },
      subBtn: { type: 'open-type', placeholder: '使用微信手机号', text: '使用微信手机号', onTap: 'getPhoneNumber' }
    },
    access_code: {
      name: 'access_code', value: '', rule: 'required|min:6', placeholder: '短信验证码', maxlength: 6, valid: 'input',
      state: { active: false, onfocus: false, collapse: false },
      subBtn: {  placeholder: '获取验证码', text: '获取验证码', onTap: 'getSmsCode', active: false }
    },
    city: {
      name: 'city', type: 'picker', required: true,
      data: { index: 0 }, method: { change: 'onPickerChange' },
      list: [{ name: '单列picker选择城市', code: null }, ...city ],keyMap: { text: 'name', value: 'code' }
    },
    zone: {
      name: 'zone', type: 'multiPicker', required: true, keyMap: { text: 'name', value: 'id' },
      data: { value: [null, null, null], temp: [ null, null, null ], index: [0, 0, 0] },
      method: { change: 'onMultiPickChange', onColumnChange: 'onColumnChange' },
      source: [province, cities, areas],
      list: [
        [{ name: '请选择', id: null }, ...province],
        [{ name: '请选择', id: null }],
        [{ name: '请选择', id: null }], 
        // [{ name: '请选择', id: null }, ...cities['110000']],
        // [{ name: '请选择', id: null }, ...areas['110100']],
      ], 
    },
    address: {
      name: 'address', value: '', placeholder: '请输入地址',
      state: { active: false, onfocus: false, collapse: false }
    },
    status: { 
      list: status, name: 'status', value: null, type: 'radio', required: true, 
      data: { index: null }, keyMap: { value: 'type', text: 'name' }
    },
    eventType: {
      list: eventType, name: 'eventType', type: 'checkbox', required: true,
      data: { index: [] }, keyMap: { value: 'type', text: 'name' }
    },
    submit: { text: '确认绑定', state: { disabled: false, }, method: { submit: 'formSubmit' } },
    reset: { 
      text: '清空表单', state: { disabled: false },
      keys: ['local_code', 'access_code', 'city', 'status', 'eventType', 'zone']
    }
  },
  onLoad (options) {},
  onReady() { },
  onShow() {},
  local_code_input(hasErr,model) {
    let { subBtn } = this.data.access_code, { name, value, maxlength } = model;
    console.log('hasErr----------------------->', hasErr)
    if (!hasErr) {
      clearInterval(this.data.timer);
      this.setData({[`access_code.value`]:'',['access_code.subBtn.active']:false,['access_code.subBtn.text']:subBtn.placeholder});
    }
    // 添加 手机号码输入框与验证码输入框的联动关系， 当手机号码修改完成后，清空原有的验证码输入框内的数据值，并且恢复 获取验证码的按钮可正常使用。
  },
  getPhoneNumber (e) { console.log(e); },
  getSmsCode (e) {
    let { local_code, access_code } = this.data, key = 'access_code.subBtn', model = access_code.subBtn;
    this._validate(local_code, {}, (val, hasErr)=>{
      if (!hasErr) {
        clearInterval(this.data.timer);
        this.data.timer = app.BZ.util.setCounting(this, key, model)
      }
    })
  },
  onPickerChange (data, model) {
    console.log('onPickChange-------------->', data, model)
  },
  onColumnChange (obj, model) {
    
  },
  zonePickerColumnChange () {

  },
  onMultiPickChange(data, model) {
    console.log('onMultiPickChange------------->', data, model)
  },
  formSubmit(req, submit, e) {
    let { state } = submit;
    if (!state.hasErr && !state.disabled) {
      this.setData({ ['submit.state.disabled']: true });
      console.log('formSubmit.req----------------------------->', req);
      setTimeout(_=>{ this.setData({ ['submit.state.disabled']: false }); },2000)
    }
  },
  
};
Object.assign(page_setting, app.BZ.ben_form)
console.log(page_setting);
Page(page_setting)