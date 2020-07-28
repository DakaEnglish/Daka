const db = wx.cloud.database()
const time = db.collection('teacher')
const app = getApp()
const _ = db.command
Page({
  data: {
    datenum: 0,
    week: "",
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
    items: [

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
  onLoad: function (option) {
    console.log(app.globalData.userid)
    this.setData({ //读取daySelect中传入的参数
      datenum: option.datenum,
      week: option.week
    })
    console.log("~~~~~data.information.date", this.data.datenum);
    console.log("~~~~~data.information.week", this.data.week);
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
          var freetime = res.data[0].freetimeTable[this.data.datenum]
          console.log(freetime)
          for (var i = 2; i < 9; i++) {
            time_list1[i - 2].dis = parseInt(freetime[i])
          }
          var items = that.data.items
          if (time_list1[0].dis == 1) {
            //console.log("in the if")
            var item = {
              name: '8-10',
              value: '8：00至10：00',
              num: 0
            }
            items.push(item)
            that.setData({
              items
            });
          }
          if (time_list1[1].dis == 1) {
            var item = {
              name: '10-12',
              value: '10：00至12：00',
              num: 1
            }
            items.push(item)
            that.setData({
              items
            });
          }
          if (time_list1[2].dis == 1) {
            var item = {
              name: '12-14',
              value: '12：00至14：00',
              num: 2
            }
            items.push(item)
            that.setData({
              items
            });
          }
          if (time_list1[3].dis == 1) {
            var item = {
              name: '14-16',
              value: '14：00至16：00',
              num: 3
            }
            items.push(item)
            that.setData({
              items
            });
          }
          if (time_list1[4].dis == 1) {
            var item = {
              name: '16-18',
              value: '16：00至18：00',
              num: 4
            }
            items.push(item)
            that.setData({
              items
            });
          }
          if (time_list1[5].dis == 1) {
            var item = {
              name: '18-20',
              value: '18：00至20：00',
              num: 5
            }
            items.push(item)
            that.setData({
              items
            });
          }
          if (time_list1[6].dis == 1) {
            var item = {
              name: '20-22',
              value: '20：00至22：00',
              num: 6
            }
            items.push(item)
            that.setData({
              items
            });
          }
          console.log("1", this.data.items)

        }
      })

  },
  toSetTimeTable: function () {
    var that = this
    var time = parseInt(this.radio)
    time += 2
    db.collection('teacher').where({
        _id: this.teacher._id
      })
      .get({
        success: res => {
          var freeTime = res.data[0].freetimeTable
          console.log(time)
          if (parseInt(freeTime[this.data.datenum][time]) == 1) {
            wx.switchTab({ //跳转到页面
              url: '../course/course' //跳转到的页面地址
            })

            freeTime[this.data.datenum][time] = app.globalData.userid
            console.log("freetime:",freeTime)
            var _id = res.data[0]._id
            var flag = 1
            for (var i = 2; i < 9; i++) {
              if (freeTime[this.data.datenum][i] == 1) {
                flag = 0
              }
            }
            if (flag == 1) {
              freeTime[this.data.datenum][1] = 0
            }
            wx.cloud.callFunction({
              // 云函数名称
              name: 'updateTeacherFreetime',
              data: {
                _id: _id,
                freetime: freeTime
              },
              success(res) {
                console.log("调用成功")
                wx.showToast({
                  title: '预约成功',
                  duration: 2000,
                  icon: 'none'
                })
              },
              fail(res) {
                console.log("调用失败")
              }
            })
            //设置时间信息完成
            var date = dateLater(0)
            console.log(date)
            var nu = that.data.datenum - date.week
            console.log(nu)
            date = dateLater(nu)
            console.log(date)
            var courseInfo = {
              teacherid: res.data[0]._id, //存储老师id
              dateInfo: date, //保存具体日期
              time: this.radio, //保存具体时间，0代表8-10点以此类推
              compareInfo: date.year + '' + date.month + '' + date.day + '' + this.radio
            }
            console.log(courseInfo)
            //上传到服务器失败
            wx.cloud.callFunction({
              // 云函数名称
              name: 'addCourseInfo',
              data: {
                openid: app.globalData.userid,
                courseInfo: courseInfo
              },
              success: function (res) {
                console.log("数据存入user")
              }
            })
          } else {
            wx.showToast({
              title: '手慢，课被抢了！请重新选择',
              duration: 1500,
              icon: 'none'
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

/**
 * 传入时间后几天
 * param：传入时间：dates:当前时间,later:往后多少天
 */
function dateLater(later) {
  let dateObj = {};
  let show_day = new Array(6, 0, 1, 2, 3, 4, 5); //0-周一
  let date = new Date();
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  console.log(day)
  dateObj.year = date.getFullYear();
  dateObj.month = date.getMonth() + 1;
  dateObj.day = date.getDate();
  dateObj.week = show_day[day];
  return dateObj;
}