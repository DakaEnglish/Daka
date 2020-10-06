const db = wx.cloud.database();
const app = getApp();
Page({
  data: {
    num: '',
    other: ''
  },
  //获取电话
  getNum(event) {
    //console.log('获取输入的电话', event.detail.value)
    this.setData({
      num: event.detail.value
    })
  },
  //获取其他信息
  otherthing(event) {
    console.log('获取输入的其他信息', event.detail.value)
    this.setData({
      other: event.detail.value
    })
  },

  //注册
  signup() {
    let num = this.data.num
    let other = this.data.other
    let teacherid = null
    let Debugger = false
    console.log("点击了注册")
    //校验手机号
    if (num.length != 11) {
      wx.showToast({
        icon: 'none',
        title: '手机号码不正确',
      })
      return
    }
    //校验其他信息
    if (other == "05f2c36f5e") {
      teacherid = "05f2c36f5eb0d95b0014e86b17e63f96"  //Karen gabuya
    } else if(other == "a9bfcffc5e"){
      teacherid = "a9bfcffc5eb0e505000fd766228a33d2"  //Kaye dianne
    } else if(other == "aa9f906d5e"){
      teacherid = "aa9f906d5eb0e55b0014a67b079168be"  //Myra
    } else if(other == "5e847ab25e"){
      teacherid = "5e847ab25eb0e4e4001854944799a782"  //Karen joy Rogacion
    } else if(other == "6e847ab25e"){
      teacherid = "5e847ab25eb0e4f7001855e529e8ed20"  //Jerson
    } else if(other == "a9bfcffc5e"){             
      teacherid = "a9bfcffc5eb0e552000fdafc7164a9c4"  //Ralf rickson estrosos
    } else if(other == "a9f906d5e"){
      teacherid = "aa9f906d5eb0e51b0014a2726fa4b506"  //Jackie quinones
    } else if(other == ''){}
    else {
      wx.showToast({
        icon: 'none',
        title: '邀请码不正确',
      })
      return
    }
    console.log(app.globalData.nickName),
    //注册功能的实现
    db.collection('user').add({
      data: {
        nickName: app.globalData.nickName,
        num: num,
        other: other,
        course: [],
        courseTimes: 0,
        teacherid: teacherid,
        Debugger: Debugger
      },
      success(res) {
        console.log('注册成功', res)
        wx.showToast({
          title: '注册成功',
        })
        if(other != ''){
          wx.navigateTo({
            url: '../teacher/teacher',
          })
        }
        wx.switchTab({
          url: '../typeCourse/typeCourse',
        }) 
      },
      fail(res) {
        console.log('注册失败', res)
      }
    })
  }
})