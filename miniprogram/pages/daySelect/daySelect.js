// pages/daySelect/daySelect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    image:"",
    freedayTable:[
      {
        lable:null,
        isfree:null,
        week:"本周一"
      },
      {
        lable:null,
        isfree:null,
        week:"本周二"
      },
      {
        lable:null,
        isfree:null,
        week:"本周三"
      },
      {
        lable:null,
        isfree:null,
        week:"本周四"
      },
      {
        lable:null,
        isfree:null,
        week:"本周五"
      },
      {
        lable:null,
        isfree:null,
        week:"本周六"
      },
      {
        lable:null,
        isfree:null,
        week:"本周日"
      },
      {
        lable:null,
        isfree:null,
        week:"下周一"
      },
      {
        lable:null,
        isfree:null,
        week:"下周二"
      },
      {
        lable:null,
        isfree:null,
        week:"下周三"
      },
      {
        lable:null,
        isfree:null,
        week:"下周四"
      },
      {
        lable:null,
        isfree:null,
        week:"下周五"
      },
      {
        lable:null,
        isfree:null,
        week:"下周六"
      },
      {
        lable:null,
        isfree:null,
        week:"下周日"
      }
    ]
  },

  gotoTimeSelect: function(event){
    var num = event.currentTarget.dataset.num;
    console.log("####num",num);
    if(this.data.freedayTable[num].lable == 0){
      wx.showToast({
        title: '已过期，请选择明天及以后的课程',
        duration: 1500,
        icon: 'none'
      })
    }else if (this.data.freedayTable[num].isfree == 0){
      wx.showToast({
        title: '该天已预约满，请选择其他日期',
        duration: 1500,
        icon: 'none'
      })
    } else{
      wx.navigateTo({
        url: '/pages/timeSelect/timeSelect?datenum=' + num + '&week=' + this.data.freedayTable[num].week 
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    try {
      var value = wx.getStorageSync('teacher') //将缓存的信息取出
      if (value) {
        console.log("day 传输成功", value)
      }
    } catch (e) {
      console.log("day 传输失败", value)
    }
    this.teacher = value
    that.setData({
      name:this.teacher.name,
      image:this.teacher.imag
    })
    console.log("!!!!!!name",this.data.name)
    console.log("!!!!!!image",this.data.image)

    var uplable;
    var upisfree;
    var upweek;
    for(var i = 0 ; i < 14 ; i++ ){
      uplable =  "freedayTable[" + i + "].lable";
      upisfree =  "freedayTable[" + i + "].isfree";
      that.setData({
        [uplable]:this.teacher.freetimeTable[i][0],
        [upisfree]:this.teacher.freetimeTable[i][1],
      })
    }
    console.log("%%%%%lable:",this.data.freedayTable[4].lable);
    console.log("%%%%%%isfree:",this.data.freedayTable[4].isfree);
    console.log("%%%%%toweek:",this.data.freedayTable[4].week);
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