let server = 'https://www.easy-mock.com/mock/5a975b72371a4725188754f5/reebok';
let url = `${server}/api/v1/order/history`;
let app = getApp();
Page({
  data: {
    orderHistory: {
      url, reqData: { pageNo: 1, pageCount: 20 },
      state: { isNoMore: false, loading: false, refresh: false },
      name: 'orderHistory',list: [],
    },
    noMoreConfig: {
      // imageUrl: '/images/common/empty_order_list.png',
      none: '暂无交易记录',
      noMore: '已无更多交易记录'
    },
  },
  onLoad (options) {
    app.request.getDataList(this, { name: 'orderHistory' });
  },
  onReady () {
  
  },
  onShow () {
  
  },
  onPullDownRefresh: function () {
    let name = 'orderHistory', listModel = this.data[name], loadingType = 'refresh';
    if (!listModel.state.refresh) {
      Object.assign(listModel.state, { refresh: true, isNoMore: false });
      Object.assign(listModel.reqData, { pageNo: 1 });
      if (loadingType) { listModel.list = []; } else { page.setData({ [name + '.list']: [] }) }
      app.request.getDataList(this, { name, loadingType });
    }
  },
  onReachBottom: function () {
    app.request.getDataList(this, { name: 'orderHistory' });
  },
  onShareAppMessage: function () {
  
  }
})