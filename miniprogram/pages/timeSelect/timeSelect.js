const db = wx.cloud.database()
const time = db.collection('teacher')
Page({
  data: {
    time_list: [{
        dis: 0
      },
      {
        dis: 0
      },
      {
        dis: 0
      },
      {
        dis: 0
      },
      {
        dis: 0
      },
      {
        dis: 0
      },
      {
        dis: 0
      },
    ],
    items: [{
        name: '8-10',
        value: '8:00至10：00'
      },
      {
        name: '10-12',
        value: '10：00至12：00'
      },
      {
        name: '12-14',
        value: '12：00至14：00'
      },
      {
        name: '14-16',
        value: '14：00至16：00'
      },
      {
        name: '16-18',
        value: '16：00至18：00'
      },
      {
        name: '18-20',
        value: '18：00至20：00'
      },
      {
        name: '20-22',
        value: '20：00至22：00'
      },
    ],
    dis0: false,
    dis1: false,
    dis2: false,
    dis3: false,
    dis4: false,
    dis5: false,
    dis6: false,
    teacher: {}
  },
  onLoad: function (options) {
    var that = this
    try {
      var value = wx.getStorageSync('teacher') //将缓存的信息取出
      if (value) {
        // Do something with return value
        console.log("传输成功", value)
        this.teacher = value
      }
    } catch (e) {
      // Do something when catch error
      console.log("传输失败", value)
    }
    var _this = this
    var time_list1 = this.data.time_list;
    console.log(this.teacher)
    db.collection('teacher').where({
        _id: this.teacher._id
      })
      .get({
        success: res => {
          console.log(res.data)
          var freetime = res.data[0].freetime
          for (var i = 0; i < 7; i++) {
            time_list1[i].dis = freetime[i]
          }

          for (var j = 0 ; j < 7 ; j++){
            if(time_list1[j].dis != 1){
              this.setData({
                dis0: true
              })
            }
          }
          
        }
      })

  },
  toSetTimeTable: function () {
    console.log("!!!!!",this.radio)
    var time = parseInt(this.radio)
    console.log("!!!!!####",this.teacher._id)
    db.collection('teacher').where({
        _id: this.teacher._id
      })
      .get({
        success: res => {
          console.log(res.data)
          var freeTime = res.data[0].freetime
          if (freeTime[time] == 1) {
            freeTime[time] = 2
            console.log(freeTime)
            //！主要问题在这里，无法将课程信息同步到数据库
            wx.cloud.callFunction({
              // 云函数名称
              name: 'updateTeacherFreetime',
              data: {
                'freetime': 'freeTime'
              },
              success(res) {
                console.log("调用成功")
                wx.showToast({
                  title: '预约成功',
                  duration: 800,
                  icon: 'none'
                })
                wx.switchTab({ //跳转到页面
                  url: '../my/my' //跳转到的页面地址
                })
              },
              fail(res){
                console.log("调用失败")
              }
            })
          }
        }
      })


  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.radio = e.detail.value
  }
})