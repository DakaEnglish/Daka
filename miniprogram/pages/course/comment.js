// miniprogram/pages/course/comment.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacher:"",
    time:"",
    comment:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let value = wx.getStorageSync('tmp')
    console.log(value)
    db.collection('course').where({
      _id: value.id
    }).get({
      success: res => {
        console.log(res)
        let datainfo = res.data[0].course.dateInfo.year + "年" + res.data[0].course.dateInfo.month + "月" + res.data[0].course.dateInfo.day + "日" + res.data[0].course.time
        that.setData({
          comment: res.data[0].course.comment.text,
          teacher: value.teacher,
          time: datainfo
        })
      },
      fail: err => {
        that.setData({
          comment: "出现错误，请重试！"
        })
        console.error("出现错误", err)
      }
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