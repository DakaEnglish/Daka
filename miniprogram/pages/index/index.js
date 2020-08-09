const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenButton: true,
    loading: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: '',
    userInfo: null
  },

  onGotUserInfo: function (e) {
    let that = this
    // 定义调用云函数获取openid
    wx.cloud.callFunction({
      name: 'getUserid',
      complete: res => {
        console.log('openid--', res.result.openid)
        this.openid = res.result.openid
        app.globalData.nickName = e.detail.userInfo.nickName
        app.globalData.userid = res.result.openid
        //console.log(app.globalData.userid)
        db.collection('user').where({
          _openid: this.openid
        }).get({
          success: function (res) {
            var user = res.data[0]
            if (res.data.length != 0) {
              console.log(user.nickName)
              console.log('登陆成功')
              that.setData({
                loading: true
              });
              console.log("openid:", user._openid)
              setTimeout(() => {
                that.setData({
                  loading: false
                });
              }, 1000);
              if (user._openid === "odV3_45DRNld663gpW04sQP3NK3c" || user._openid === "odV3_40bsUVw28aRbwNBDIC6VRoY") {
                wx.navigateTo({
                  url: '../choosepage/choosepage',
                })
              } else {
                wx.switchTab({
                  url: '../select/select',
                })
              }
              wx.setStorageSync('user', user)
            } else {
              console.log("未注册")
              wx.navigateTo({
                url: '../signup/signup',
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let _this = this
    this.setData({
      loading: true
    });
    try {
      setTimeout(() => {
        this.setData({
          loading: false
        });
      }, 1000);
      var value = wx.getStorageSync('user')
      app.globalData.nickName = value.nickName
      app.globalData.userid = value._openid
      if (value._openid === "odV3_45DRNld663gpW04sQP3NK3c" || value._openid === "odV3_40bsUVw28aRbwNBDIC6VRoY") {
        //console.log(value._openid)
        wx.navigateTo({
          url: '../choosepage/choosepage',
        })
      } else if (value._openid != null) {
        wx.switchTab({
          url: '../select/select',
        })
      }
    } catch (e) {
      //需要用户同意授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            app.globalData.auth['scope.userInfo'] = true //将授权结果写入app.js里的全局变量
            wx.cloud.callFunction({
              name: 'get_setUserInfo',
              data: {
                getSelf: true
              },
              success: res => {
                if (res.errMsg == "cloud.callFunction:ok" && res.result) {
                  //如果成功获取到，将用户资料写入app.js的全局变量
                  console.log(res)
                  app.globalData.userInfo = res.result.data.userData
                  app.globalData.userId = res.result.data._id
                  wx.switchTab({
                    url: '/pages/course'
                  })
                } else {
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
                //console.error("get_setUserInfo调用失败",err.errMsg)
              }
            })
          } else {
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
          console.error("wx.getSetting调用失败", err.errMsg)
        }
      })
    }
  }
})