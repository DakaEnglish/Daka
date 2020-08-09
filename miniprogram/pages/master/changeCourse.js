// miniprogram/pages/master/changeCourse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseTimes: 0,
    nickname: null,
    telephone: null,
    openid: null,
    addTimes: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    try {
      var value = wx.getStorageSync('target')
      if (value) {
        this.setData({
          courseTimes: value.courseTimes,
          nickname: value.nickName,
          telephone: value.num,
          openid: value._openid
        })
      }
    } catch (e) {
      console.log("请求失败", res)
    }
    wx.removeStorageSync('target')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync('target')
  },

  getNum(event) {
    console.log('获取输入的次数', event.detail.value)
    this.setData({
      addTimes: event.detail.value
    })
    console.log(this.data.addTimes)
  },

  setValue: function () {
    let times = this.data.addTimes * 1 + this.data.courseTimes * 1
    console.log(times)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'changeCourseTimes',
      // 传递给云函数的参数
      data: {
        openid: this.data.openid,
        courseTimes: times,
      },
      success: res => {
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            wx.navigateTo({
              url: '../master/master'
            })
          }
        })
      },
      fail: err => {
        wx.showToast({
          title: '修改失败，请重试！',
          duration: 2000
        })
        console.error("wx.getSetting调用失败", err.errMsg)
      }
    })
  }
})