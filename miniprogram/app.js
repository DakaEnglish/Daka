//app.js
App({
  //声明一些全局数据
  globalData:{
    userid: '',
    nikeName: '',
    auth: {
      'scope.userInfo': false //用户授权状态
    },
    logged: false //登录状态
  },
  onLaunch: function () {
    wx.cloud.init({
      env:"courseselect-pyznx",	//云服务器环境id
      traceUser:true
    })
  }
})
