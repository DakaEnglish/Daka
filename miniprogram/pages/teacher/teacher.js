// miniprogram/pages/choosepage/choosepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  gotoSelect: function(event){
    //跳转页面
    wx.navigateTo({
      url: '../teacher/course'
    })
  },

  gotoTeacher: function(event){
    //跳转页面
    wx.navigateTo({
      url: '/pages/teacher/select'
    })
  },
})