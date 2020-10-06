// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacher: {},
    dis:false,
    flag:1      //判断是否有时间
  },

  toSelectTime: function () { //再点击“选课”按钮时执行这个方法、
    console.log("toSelectTime flag:",this.data.flag)
    /*
    if (this.data.flag) {
      console.log('老师时间已满')
      this.dis = true
      wx.showToast({
        title: '该老师时间已预约满，请更换教师',
        duration: 800,
        icon: 'none'
      })
    }
    else{
      */
      wx.navigateTo({ //跳转到页面
        url: '../demo/ui-calendar' //跳转到的页面地址
      })
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    try {
      var value = wx.getStorageSync('teacher') //将缓存的信息取出
      if (value) {
        console.log("传输成功", value)
        that.setData({
          teacher: value
        })
      }
    } catch (e) {
      console.log("传输失败", value)
    }
    /*
    this.teacher = value
    for (var i = 0; i < 14; i++) {
      if (this.teacher.freetime[i][0] == 1 && this.teacher.freetime[i][1] == 1) { //未过期且有可选
        this.data.flag = 0;
      }
    }
    if (this.data.flag) {
      console.log('老师时间已满')
      this.dis = true
      wx.showToast({
        title: '该老师时间已预约满，请更换教师',
        duration: 800,
        icon: 'none'
      })
    }
    */
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