const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenButton: true
  },
  onGotUserInfo: function(e){
    var _this = this
    if (e.detail.errMsg == "getUserInfo:ok"){
      app.globalData.auth['scope.userInfo'] = true
      wx.cloud.callFunction({
        name: 'get_setUserInfo',
        data: {
          getSelf: true
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok")//需要同意授权
            if (res.result) {
              //当成功获取到用户信息时，将用户资料写入app.js的全局变量中
              console.log(res)
              app.globalData.userInfo = res.result.data.userData
              app.globalData.userId = res.result.data._id
              wx.switchTab({
                url:'/pages/course'//登录完成后进入带tabber的主页
              })
            }
            else {
              //未成功，进入注册环节
              console.log("未注册")
              _this.register({
                nickName: e.detail.userInfo.nickName,
                gender: e.detail.userInfo.gender,
                avatarUrl: e.detail.userInfo.avatarUrl,
                studentNumber: "none"
              })
            }
        },
        fail: err => {
          wx.showToast({
            title: '错误',
            duration: 800,
            icon: 'none'
          })
          console.error("get_setUserInfo调用失败",err.errMsg)
        }
      })
    }
    else
     console.log("未授权")
  },
  //注册阶段
  register: function(e) {
    let _this = this
    wx.cloud.callFunction({
      name: 'get_setUserInfo',
      data: {
        setSelf: false,
        userData: e
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok" && res.result){
          _this.setData({
            hiddenButton: true
          })
          app.globalData.userInfo = e
          app.globalData.userId = res.result._id
          _this.data.registered = true
          app.getLoginState()
          console.log(res)
          wx.navigateTo({
            url:'/pages/my'//页面跳转(不能跳转到tabbar页面)，个人认为要跳转到我的页面，故用的navigateTo
          })
        }
        else{
          console.log("注册失败",res)
          wx.showToast({
            title: '注册失败，请检查您的网络状态',
            duration: 800,
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: '注册失败，请检查您的网络状态',
          duration: 800,
          icon: 'none'
        })
        console.error("get_setUserInfo调用失败",err.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let _this = this
    //需要用户同意授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']){
          app.globalData.auth['scope.userInfo'] = true//将授权结果写入app.js里的全局变量
          wx.cloud.callFunction({
            name: 'get_setUserInfo',
            data: {
              getSelf: true
            },
            success: res => {
              if(res.errMsg == "cloud.callFunction:ok" && res.result){
                //如果成功获取到，将用户资料写入app.js的全局变量
                console.log(res)
                app.globalData.userInfo = res.result.data.userData
                app.globalData.userId = res.result.data._id
                wx.switchTab({
                  url: '/pages/course'
                })
              }
              else{
                _this.setData({
                  hiddenButton: false
                })
                console.log("未注册")
              }
            },
            fail: err => {
              _this.setData({
                hiddenButton: false
              })
              wx.showToast({
                title: '注册失败，请检查您的网络状态',
                duration: 800,
                icon: 'none'
              })
              console.error("get_setUserInfo调用失败",err.errMsg)
            }
          })
        }
        else{
          _this.setData({
            hiddenButton: false
          })
          console.log("未授权")
        }
      },
      fail(err) {
        _this.setData({
          hiddenButton: false
        })
        console.error("wx.getSetting调用失败",err.errMsg)
      }
    })
  }
})
