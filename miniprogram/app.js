//app.js
App({
  //声明一些全局数据
  globalData:{
    userid: '',
    userInfo: null,
    nikeName: '',
    appid:'wx0a865091a610fc72',
    secret:'30be707fde9568d6624dbd43d79f9f5c',
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
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
  }
})
