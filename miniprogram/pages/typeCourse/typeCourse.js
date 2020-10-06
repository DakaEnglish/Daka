// pages/typeCourse/typeCourse.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    topic: ['Part1-家乡 Hometown','Part1-校园生活 School Life','Part1-日常生活 Daily Routine','Part1-爱好Hobbies','Part2-人物题-描述你的好朋友 Describe your best friend','Part2-人物题-描述一个你知道的有智慧的人 Describe an intelligent person you know','part2-人物题-描述一个外语说得好的人 Describe a person who speaks a foreign language well','part2-人物题-描述一个你想一起学习或者工作的人 Describe someone you would like to study or work with','part2-地点题-描述一个公园 Describe a park','part2-地点题-描述一个你去过的城市 Describe a city you have visited','part2-地点题-描述一个人们去听音乐的地方 Describe a place you know where people go to listen to music','part2-地点题-描述你理想中的家 Describe your ideal home','Part3-比较题-报纸和杂志的差异 What are the differences between newspapers and magazines？']
  },

  IELTS: function (event) {
    this.setData({
      type: 1,
      topic: ['Part1-家乡 Hometown','Part1-校园生活 School Life','Part1-日常生活 Daily Routine','Part1-爱好Hobbies','Part2-人物题-描述你的好朋友 Describe your best friend','Part2-人物题-描述一个你知道的有智慧的人 Describe an intelligent person you know','part2-人物题-描述一个外语说得好的人 Describe a person who speaks a foreign language well','part2-人物题-描述一个你想一起学习或者工作的人 Describe someone you would like to study or work with','part2-地点题-描述一个公园 Describe a park','part2-地点题-描述一个你去过的城市 Describe a city you have visited','part2-地点题-描述一个人们去听音乐的地方 Describe a place you know where people go to listen to music','part2-地点题-描述你理想中的家 Describe your ideal home','Part3-比较题-报纸和杂志的差异 What are the differences between newspapers and magazines？']
    })
  },

  TOEFL: function (event) {
    this.setData({
      type: 2,
      topic: ['21221']
    })
  },

  interview: function (event) {
    this.setData({
      type: 3,
      topic: ['AAAA']
    })
  },

  business: function (event) {
    this.setData({
      type: 4,
      topic: ['%^%$^%']
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