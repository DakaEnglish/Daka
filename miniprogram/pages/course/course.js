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
      let value1 = a[property];
      let value2 = b[property];
      return value1 - value2;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let id = app.globalData.userid
    console.log("userid:", id)

    let that = this
    db.collection('user').where({
        _openid: id
      }).get({
        success: res => {
          var course = res.data[0].course
          console.log("sorted:", course)
          var date = new Date()
          var month = date.getMonth()
          var day = date.getDate()
          //console.log(month, day)
          for (var i = 0; course[i] != null; i++) {
            (function (i) {
              //console.log("iiii=", i)
              var week = course[i].dateInfo.week
              var toweek = that.changeweek(week)
              var totime = course[i].time
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
    if (week == 1) return "星期一";
    if (week == 2) return "星期二";
    if (week == 3) return "星期三";
    if (week == 4) return "星期四";
    if (week == 5) return "星期五";
    if (week == 6) return "星期六";
    if (week == 7) return "星期日";
  },
})