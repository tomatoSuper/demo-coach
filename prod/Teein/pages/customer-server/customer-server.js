var emojImgObj = require("../../js/emoj-match.js");
var emojMatch = require("../../js/emoj-object.js");
var sdk = require("../../js/NIM_Web_SDK_v4.3.0-beta.js");
var flag = 0;
var chatScrollViewHeight;//聊天可视区域高度
var prviewImageFlag = true;
//获取应用实例
var app = getApp();
Page({
  //数据
  data: {
    wechatId: '',
    unionId: '',
    chatDataList: "",//聊天数据
    audioVoiceHidden: false,//语音-语音图片
    audioKeyBoardHidden: true,//语音-键盘图片
    textareaHidden: false,//输入框-文本
    emojExpressionHidden: false,//表情-表情图片
    emojKeyBoardHidden: true,//表情-键盘图片
    sendFileHidden: false,//发送-文件
    sendTextHidden: true,//发送-按钮
    footSourceHidden: true,//表情和素材外包框
    emojHidden: false,//表情框
    materialHidden: true,//素材框
    scrollTop: 100000,
    ActiveChatScrollViewHeight: "",//实际聊天可视区域高度
    inputVal: "我是输入框",//输入框的值
    inputFocus: false//输入框
  },
  getChatHeight: function () {
    var that = this;
    //获取手机窗口高度 为了初始撑开页面 避免输入框在顶部
    wx.getSystemInfo({
      success: function (res) {
        chatScrollViewHeight = res.windowHeight - 46 + "px",
          chatScrollViewHeight2 = res.windowHeight - 46 - 122 + "px";
        that.setData({
          ActiveChatScrollViewHeight: chatScrollViewHeight
        })
      }
    })
  },
  onShow: function () {
    if (prviewImageFlag == 1) return false;
    var that = this;
    that.getChatHeight();
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      wechatId: app.globalData.wechatId,
      unionId: app.globalData.unionId
    })
  },
});