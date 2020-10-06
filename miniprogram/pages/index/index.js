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
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            fail() {
              wx.showModal({
                title: '提示',
                content: '若点击不授权，将无法继续登陆',
                cancelText: '不授权',
                cancelColor: '#999',
                confirmText: '授权',
                confirmColor: '#f94218',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        console.log(res.authSetting)
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      }
    })
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
              if (user.Debugger) {
                wx.navigateTo({
                  url: '../choosepage/choosepage',
                })
              } else if (user.teacherid) {
                wx.navigateTo({
                  url: '../teacher/teacher',
                })
              } else {
                wx.switchTab({
                  url: '../typeCourse/typeCourse',
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
   
  onLoad: function () {
    let _this = this
    this.setData({
      loading: true
    });
    //需要用户同意授权
    console.log(res)
    app.globalData.userInfo = res.result.data.userData
    app.globalData.userId = res.result.data._id
    this.setData({
      loading: false
    });
    if (value.Debugger) {
      wx.navigateTo({
        url: '../choosepage/choosepage',
      })
    } else if (value.teacherid != null) {
      wx.navigateTo({
        url: '../teacher/teacher',
      })
    } else {
      wx.switchTab({
        url: '../typeCourse/typeCourse',
      })
    }
    _this.setData({
      hiddenButton: false
    })
    console.log("未注册")
  }
  //*/
})