// miniprogram/pages/choosepage/choosepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  gotoSelect: function(event){
    //跳转页面
    wx.switchTab({
      url: '/pages/select/select'
    })
  },

  gotoTeacher: function(event){
    //跳转页面
    wx.navigateTo({
      url: '/pages/teacher/teacher'
    })
  },

  gotoMaster: function(event){
    //跳转页面
    wx.navigateTo({
      url: '/pages/master/master'
    })
  },
})