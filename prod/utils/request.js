const Token_Key = 'token';
const renderTime = 1500;
module.exports = { renderTime, request, doPost, doGet, login, getDataList, refreshDataList };
function getDataList(page, { name, loadingType, setList, setSetting, method, isRender }) {
  let _type = loadingType ? '.state.' + loadingType : '.state.loading';
  isRender = isRender == undefined || isRender == true;
  let nameArr = name.split('.');
  let listModel = nameArr.length > 1 ? page.data[nameArr[0]][nameArr[1]] : page.data[name];
  let { reqData, url, list, state } = listModel, { loading, isNoMore } = state;
  if (!isNoMore && !loading) {
    page.setData({ [name + _type]: true, [name + '.isNoMore']: false });
    let reqTime = new Date().getTime();
    let config = { url, data: reqData, success };
    method === 'post' ? doPost(config) : doGet(config);
    function success(res) {
      let diffTime = new Date().getTime() - reqTime;
      let res_data = res.data.data;
      let res_list = res_data;
      // res_list = []
      isNoMore = !res_list.length || res_list.length < reqData.pageCount;
      var settings = { [name + _type]: false };
      if (res_list.length) {
        typeof setList === 'function' ? setList(res_list) : null
        list.push(...res_list);
        reqData.pageNo = isNoMore ? reqData.pageNo : reqData.pageNo + 1;
        if (isRender) { settings[name + '.list'] = list; }
      }
      settings[name + '.state.isNoMore'] = isNoMore;
      typeof setSetting === 'function' ? setSetting(settings, res_data) : null
      diffTime < renderTime ? setTimeout(_ => { renderDataList(settings); }, renderTime - diffTime) : renderDataList(settings);
    }
  }
  function renderDataList(object) {
    page.setData(object);
    if (loadingType) { wx.stopPullDownRefresh() }
  }
}

function refreshDataList(page, { name, loadingType, method }) {
  let model = page.data[name]
  model.reqData.pageNo = 1;
  model.state.isNoMore = false;
  if (loadingType) { model.list = []; }
  else { page.setData({ [name + '.list']: [] }) }
  page.getDataList({ name, loadingType, method });
}

function doGet(opt) {
  opt.header = opt.header || {};
  let token = wx.getStorageSync(Token_Key);
  if (token) { opt.header.token = token } else { fnNoneToken() }
  request(opt);
}

function doPost(opt) {
  opt.method = 'POST';
  opt.header = opt.header || {};
  let token = wx.getStorageSync(Token_Key);
  if (token) { opt.header.token = token } else { fnNoneToken() }
  request(opt);
}

function login(opt) { request(opt) }


function request(opt) {
  let header = { 'content-type': 'application/json' }; // 默认值
  if (opt.header) { Object.assign(header, opt.header) }
  wx.request({
    url: opt.url,
    dataType: opt.dataType || 'json',
    header,
    method: opt.method || 'GET',
    data: opt.data,
    success(res) {
      wx.hideNavigationBarLoading();
      !!opt.success && typeof opt.success === 'function' && opt.success(res)
    },
    fail(res) {
      !!opt.res && typeof opt.res === 'function' && opt.res(res)
    }
  });
}

function fnNoneToken() {
  console.log('There is None Token')
}