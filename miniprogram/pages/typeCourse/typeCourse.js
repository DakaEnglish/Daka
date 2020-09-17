// pages/typeCourse/typeCourse.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    topic: ['aaaaaaa', 'bbbbbbbb', 'cccccccccc']
  },

  IELTS: function (event) {
    this.setData({
      type: 1,
      topic: ['aaaaaaa', 'bbbbbbbb', 'cccccccccc']
    })
  },

  TOEFL: function (event) {
    this.setData({
      type: 2,
      topic: ['21221', '55645', '098765']
    })
  },

  interview: function (event) {
    this.setData({
      type: 3,
      topic: ['AAAA', 'JGFJ', 'LULULU']
    })
  },

  business: function (event) {
    this.setData({
      type: 4,
      topic: ['%^%$^%', '++++', '@@@@@']
    })
  },

  jump: function (event) {
    wx.navigateTo({
      url: '/pages/select/select'
    })
  },

  onGotUserInfo: function () {
    wx.clearStorage()
    wx.openSetting({})
    wx.getSetting({
      success(res) {
        // 如果没有则跳转
        console.log(res.authSetting)
        if (!res.authSetting['scope.userInfo']) {
          wx.reLaunch({
            url: '../index/index',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})