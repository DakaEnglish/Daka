const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateInfo: [],
    weeks: ['一', '二', '三', '四', '五', '六', '日'],
    days: [],
    year: 0,
    month: 0,
    teacherid: null,
    courseRemain: 0,
    database: 0,
    dayInfos: [],
    teacher: ' ',
    time: ' ',
    dialogShow: false,
    showOneButtonDialog: false,
    warnTime: false,
    conform: false,
    e: null,
    empty: true,
    freetimeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.dateData();
    db.collection('user').where({
      _openid: getApp().globalData.userid
    }).get({
      success: res => {
        console.log(res.data[0].courseTimes)
        this.setData({
          courseRemain: res.data[0].courseTimes
        })
        if (this.data.courseRemain <= 0) {
          this.setData({
            showOneButtonDialog: true
          })
          console.error('课程剩余不足：', this.data.courseRemain)
        }
      }
    })
  },

  getdayinfo: function (e) {
    var openid = getApp().globalData.userid //获取用户信息
    console.log("openid" + openid)
    var year = e.currentTarget.dataset.year
    var month = e.currentTarget.dataset.month
    var day = e.currentTarget.dataset.value
    console.log(year + "-" + month + "-" + day)
    var date = e.currentTarget.dataset
    var dayclass = "days-item-text-select";
    this.updateDays(year, month, day)
    console.log(e.currentTarget)
    this.getBookAll(date)
  },

  //获取当前为第几周
  getWeek: function () {
    var d1 = new Date();
    var d2 = new Date();
    d2.setMonth(0);
    d2.setDate(1);
    var rq = d1 - d2;
    var s1 = Math.ceil(rq / (24 * 60 * 60 * 1000));
    return Math.ceil(s1 / 7);
  },

  getBookAll: function (date) {
    let that = this
    try {
      var value = wx.getStorageSync('teacher') //将缓存的信息取出
      if (value) {
        console.log("传输成功", value)
        var teacher = value
        that.data.teacherid = teacher._id
        that.data.teacher = teacher.name
        console.log(that.data.teacher)
      }
    } catch (e) {
      console.log("传输失败", value)
    }
    var dateDay = date.week;
    var week = this.getWeek() % 2;
    console.log("dateWeek", week)
    that.data.database = week
    //保险起见，再次查询确定某些时间段有课
    db.collection('teacher').where({
        _id: teacher._id,
      })
      .get({
        success: res => {
          //console.log(res.data[0])
          var freetimeList = res.data[0].freetime[week][dateDay - 1]
          //console.log(freetimeList)
          var dateInfos = []
          var i = 0
          freetimeList.forEach(element => {
            if (element.available) {
              that.data.empty = false
              //console.log(that.data.empty)
              var dateInfo = {
                "name": element.time,
                "id": i,
                "available": element.available,
                "date": that.data.dateInfo[dateDay - 1]
              }
              dateInfos.push(dateInfo)
            }
            i++
          });
          that.setData({
            dayInfos: dateInfos,
          })
          console.log(dateInfos)
        },
        fail: err => {
          console.error('调用失败', err)
        }
      })
  },

  book: function (e) {
    let that = this
    e = this.data.e
    this.setData({
      dialogShow: false,
    })
    let date = e.currentTarget.dataset.date
    var times = this.data.courseRemain - 1
    var today = new Date().getFullYear() + '' + (new Date().getMonth() + 1) + '' + new Date().getDate()
    var chooseday = e.currentTarget.dataset.date.year + "" + e.currentTarget.dataset.date.month + '' + e.currentTarget.dataset.date.day
    this.data.time = e.currentTarget.name
    var courseRemain = this.data.courseRemain
    db.collection('teacher').where({
      _id: this.data.teacherid,
    }).get({
      success: res => {
        //console.log(res.data[0].freetime)
        let week = date.week - 1
        let base = that.data.database
        let id = e.currentTarget.dataset.id
        let freetimeList = res.data[0].freetime
        //console.log(freetimeList,base,week,id)
        freetimeList[base][week][id].studentOpenId = getApp().globalData.userid
        freetimeList[base][week][id].available = false
        //console.log(freetimeList)
        that.setData({
          freetimeList: freetimeList
        })
        console.log(that.data.freetimeList)
        wx.cloud.callFunction({
          // 云函数名称
          name: 'updateTeacherFreetime',
          data: {
            _id: that.data.teacherid,
            freetime: that.data.freetimeList
          },
          success: res=> {
            console.log("调用成功")
            wx.showToast({
              title: '预约成功',
              duration: 2000,
              icon: 'none'
            })
            //设置用户信息
            var courseInfo = {
              teacherid: that.data.teacherid, //存储老师id
              dateInfo: e.currentTarget.dataset.date, //保存具体日期
              time: e.currentTarget.dataset.name, //保存具体时间，0代表8-10点以此类推
              compareInfo: e.currentTarget.dataset.date.year + '' + e.currentTarget.dataset.date.month + '' + e.currentTarget.dataset.date.day + '' + e.currentTarget.dataset.id,
              comment: { //评论
                text: "",
                flag: 0 //0-未评价
              },
              meetingInfo:{
                num: "",
                flag: false
              },
              bookBy: getApp().globalData.nickName,
              openid: getApp().globalData.userid,
            }
            console.log(courseInfo)
            //上传到服务器失败
            wx.cloud.callFunction({
              // 云函数名称
              name: 'CourseInfo',
              data: {
                courseInfo: courseInfo
              },
              complete: res=> {
                console.log(res.result)
                wx.cloud.callFunction({
                  // 云函数名称
                  name: 'addCourseInfo',
                  data: {
                    openid: getApp().globalData.userid,
                    id: that.data.teacherid,
                    courseInfo: courseInfo,
                    courseid: res.result.id._id
                  },
                  success: res => {
                    console.log("times", times)
                    wx.cloud.callFunction({
                      // 要调用的云函数名称
                      name: 'changeCourseTimes',
                      // 传递给云函数的参数
                      data: {
                        openid: getApp().globalData.userid,
                        courseTimes: times,
                      },
                      success: res => {
                        wx.switchTab({ //跳转到页面
                          url: '../course/course' //跳转到的页面地址
                        })
                      },
                      fail: err => {
                        wx.showToast({
                          title: '修改失败，请重新选课！',
                          duration: 2000
                        })
                        console.error("wx.getSetting调用失败", err.errMsg)
                      }
                    })
                  }
                })
              },
            })
          }
        })
      },
      fail(res) {
        console.log("调用失败")
      }
    })
  },

  dateData: function () {
    var date = new Date();
    var days = [];
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var week = date.getDay();
    var dateout = {
      'year': year,
      'month': month,
      'value': day,
      'week': week
    }
    this.setInfo(year, month);
    this.updateDays(year, month, day)
    this.getBookAll(dateout) //根据默认日期获取列表数据
  },

  //生成日历，目前生成本周7天的日期
  updateDays: function (year, mouth, day) {
    let days = [];
    let dateDay = new Date().getDay();
    let date = new Date().getDate();
    let lastDay = new Date(year, mouth, 0).getDate(); //本月最后一天
    let i = 1
    //向数组中添加天
    for (let index = date - dateDay + 1; index <= date + 7 - dateDay; index++, i++) {
      //console.log(day+"=="+index)
      if (index == lastDay + 1) {
        index = 1;
        for (let index = 1; index <= 7 - dateDay; index++) {
          if (day == index) {
            days.push({
              "value": index,
              "class": "days-item-text-select",
              "week": i
            })
          } else {
            days.push({
              "value": index,
              "class": "days-item-text",
              "week": i
            })
          }
        }
        break;
      }
      if (day == index) {
        days.push({
          "value": index,
          "class": "days-item-text-select",
          "week": i
        })
      } else {
        days.push({
          "value": index,
          "class": "days-item-text",
          "week": i
        })
      }

    }
    //向数组中添加，一号之前应该空出的空格
    for (let index = date - dateDay; index <= date + 6 - dateDay; index++) {
      days.unshift(0)
    }
    //console.log(days)

    this.setData({
      days: days,
      year: year,
      month: mouth,
      week: dateDay
    })
  },

  setInfo: function (year, month) {
    var dateInfo = [];
    var dateDay = new Date().getDay();
    var date = new Date().getDate();
    var lastDay = new Date(year, month, 0).getDate(); //本月最后一天
    var i = 1
    //向数组中添加天
    for (let index = date - dateDay + 1; index <= date + 7 - dateDay; index++, i++) {
      //console.log(day+"=="+index)
      if (index == lastDay + 1) {
        index = 1;
        for (let index = 1; index <= 7 - dateDay; index++, i++) {
          dateInfo.push({
            'year': month == 12 ? year + 1 : year,
            'month': month + 1,
            'day': index,
            'week': i
          })
        }
        break;
      }
      dateInfo.push({
        'year': year,
        'month': month,
        'day': index,
        'week': i
      })
    }

    this.setData({
      dateInfo: dateInfo
    })
    console.log(this.data.dateInfo)
  },

  //课程剩余弹窗开启
  dialog(e) {
    var courseRemain = this.data.courseRemain
    if (courseRemain <= 0) {
      wx.showToast({
        icon: 'none',
        title: '课程次数剩余不足'
      })
      console.error('课程剩余不足：', courseRemain)
    }
  },

  //
  conform(e) {
    var courseRemain = this.data.courseRemain
    let date = e.currentTarget.dataset.date
    var times = this.data.courseRemain - 1
    var today = new Date().getFullYear() + '' + (new Date().getMonth() + 1) + '' + new Date().getDate()
    var chooseday = e.currentTarget.dataset.date.year + "" + e.currentTarget.dataset.date.month + '' + e.currentTarget.dataset.date.day
    this.data.time = e.currentTarget.name
    var courseRemain = this.data.courseRemain
    if (chooseday <= today) {
      console.log("今天的课程无法选择")
      this.setData({
        warnTime: true
      })
    } else if (courseRemain <= 0) {
      wx.showToast({
        icon: 'none',
        title: '课程次数剩余不足'
      })
      console.error('课程剩余不足：', courseRemain)
    } else {
      this.setData({
        dialogShow: true,
        e: e
      })
    }
  },

  //控制一般弹窗关闭
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false,
      warnTime: false
    })
  },

  //控制跳转弹窗关闭
  tapDialogButton1(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false,
      warnTime: false
    })
    wx.switchTab({
      url: '../course/course',
    })
  },
})

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