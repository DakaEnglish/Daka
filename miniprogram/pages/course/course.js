const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: null,
    todayEmpty: 0,
    otherTimeEmpty: 0
  },
  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var id = app.globalData.userid
    console.log("userid:", id)

    var that = this
    db.collection('user').where({
        _openid: id
      }).orderBy('course.dateInfo.month', 'asc')
      .orderBy('course.dateInfo.day', 'asc')
      .orderBy('course.time', 'asc')
      .get({
        success: res => {
          var course = res.data[0].course
          //console.log("******", course)
          course.sort(that.compare("compareInfo"));
          //console.log("sorted:", course)
          var date = new Date()
          var month = date.getMonth()
          var day = date.getDate()
          //console.log(month, day)
          for (var i = 0; course[i] != null; i++) {
            (function (i) {
              //console.log("iiii=", i)
              var week = course[i].dateInfo.week
              var toweek = that.changeweek(week)
              var time = course[i].time
              var totime = that.changetime(time)
              var teacherid = course[i].teacherid
              //console.log("Date:", course[i].dateInfo)
              if(course[i].dateInfo.month < month + 1 || course[i].dateInfo.day < day && course[i].dateInfo.month == month + 1) {
                that.setData({ 
                  ['courseList[' + i + '].type']: 0
                })
              }
              else if (course[i].dateInfo.day == day && course[i].dateInfo.month == month + 1) {
                that.setData({ 
                  todayEmpty: 1,
                  ['courseList[' + i + '].type']: 1
                })
                //console.log(that.data.todayEmpty)
              } else {
                that.setData({ 
                  otherTimeEmpty: 1,
                  ['courseList[' + i + '].type']: 2
                })
              }
                db.collection('teacher').where({
                    _id: teacherid
                  })
                  .get({
                    success: res_1 => {
                      var name = res_1.data[0].name
                      var image = res_1.data[0].imag
                      //console.log("month",course[i].dateInfo.month,"i=",i)
                      that.setData({
                        ['courseList[' + i + '].teachername']: name,
                        ['courseList[' + i + '].teacherimage']: image
                      })
                      //console.log("**name:", that.data.courseList)
                    }
                  }),
                  //console.log("!!!!!!!!!!!",toweek)
                  //console.log("!!!!!!!!!!!",totime)

                  that.setData({
                    ['courseList[' + i + '].dateInfo']: course[i].dateInfo,
                    ['courseList[' + i + '].teacherid']: course[i].teacherid,
                    ['courseList[' + i + '].week']: toweek,
                    ['courseList[' + i + '].time']: totime
                  })
            })(i);
          }
        }
      })
  },
  changeweek: function (week) {
    if (week == 0) return "星期一";
    if (week == 1) return "星期二";
    if (week == 2) return "星期三";
    if (week == 3) return "星期四";
    if (week == 4) return "星期五";
    if (week == 5) return "星期六";
    if (week == 6) return "星期日";
  },

  changetime: function (time) {
    if (time == "0") return "8:00 - 10:00";
    if (time == "1") return "10:00 - 12:00";
    if (time == "2") return "12:00 - 14:00";
    if (time == "3") return "14:00 - 16:00";
    if (time == "4") return "16:00 - 18:00";
    if (time == "5") return "18:00 - 20:00";
    if (time == "6") return "20:00 - 22:00";
  }
})