// miniprogram/pages/master/master.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.cloud.database().collection("user").orderBy('num', 'asc').get({
      success(res){
        console.log("请求成功",res)
        that.setData({
          studentList : res.data
        })
      },
      fail(res){
        console.log("请求失败",res)
      }
    })
  },

  setValue: function (event) {
    var num = event.currentTarget.dataset.num;   //num为teacherList数组的index
    wx.setStorageSync('target', this.data.studentList[num])
    wx.navigateTo({
      url: '../master/changeCourse'
    })
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