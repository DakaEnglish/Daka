// pages/select/select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherList:[],
    name: [1,2,3]
  },

  gotoPage: function(event){
    let num = event.currentTarget.dataset.num;   //num为teacherList数组的index
    let that = this
    //通过缓存的方式传输数据
    try {
      wx.setStorageSync('teacher',this.data.teacherList[num])
      console.log("缓存成功") 
    } catch (e) {
        console.log("缓存失败")
     }
  
    //跳转页面
    wx.navigateTo({
      url: '/pages/detail/detail'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //从数据库teacheer里读取教师信息
    wx.cloud.database().collection("teacher").get({
      success(res){
        console.log("请求成功",res)
        that.setData({
          teacherList : res.data
        })
      },
      fail(res){
        console.log("请求失败",res)
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