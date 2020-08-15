const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: null,
    todayEmpty: 0,
    inTwoDayEmpty: 0,
    otherTimeEmpty: 0,
    hiddenmodalput: true
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
    let that = this
    try {
      let value = wx.getStorageSync('user')
      var id = value.teacherId
    } catch (e) {
      console.log("调用失败", e)
    }
    console.log("userid:", id)
    db.collection('teacher').where({
      _id: id
    }).get({
      success: res => {
        console.log(res.data[0].course)
        let courseid = res.data[0].course
        //console.log(course)
        let i = 0
        courseid.forEach(element => {
          (function (i) {
            db.collection('course').where({
              _id: element
            }).get({
              success: res => {
                //console.log(res.data[0].course)
                let course = res.data[0].course
                let date = new Date()
                let month = date.getMonth()
                let day = date.getDate()
                //console.log(month, day)
                //(function (i) {
                //console.log(course)
                let week = course.dateInfo.week
                let toweek = that.changeweek(week)
                let totime = course.time
                let teacherid = course.teacherid
                let bookBy = course.bookBy
                console.log("Date:", course.dateInfo, i)
                if (course.dateInfo.month < month + 1 || course.dateInfo.day < day && course.dateInfo.month == month + 1) {
                  that.setData({
                    ['courseList[' + i + '].type']: 0
                  })
                } else if (course.dateInfo.month == month + 1 && course.dateInfo.day == day) {
                  that.setData({
                    todayEmpty: 1,
                    ['courseList[' + i + '].type']: 1
                  })
                } else if (!course.meetingInfo.flag) {
                  that.setData({
                    inTwoDayEmpty: 1,
                    ['courseList[' + i + '].Mtype']: 1
                  })
                  //console.log(that.data.todayEmpty)
                }
                if (course.comment.flag == 0) {
                  that.setData({
                    otherTimeEmpty: 1,
                    ['courseList[' + i + '].Ctype']: 1,
                  })
                }

                db.collection('teacher').where({
                    _id: teacherid
                  })
                  .get({
                    success: res_1 => {
                      let name = res_1.data[0].name
                      let image = res_1.data[0].imag
                      console.log("month", course.dateInfo.month, "i=", i)
                      that.setData({
                        ['courseList[' + i + '].teachername']: name,
                        ['courseList[' + i + '].teacherimage']: image
                      })
                      console.log("**name:", that.data.courseList)
                    }
                  }),
                  //console.log("!!!!!!!!!!!",toweek)
                  //console.log("!!!!!!!!!!!",totime)
                  that.setData({
                    ['courseList[' + i + '].dateInfo']: course.dateInfo,
                    ['courseList[' + i + '].teacherid']: course.teacherid,
                    ['courseList[' + i + '].week']: toweek,
                    ['courseList[' + i + '].time']: totime,
                    ['courseList[' + i + '].bookBy']: bookBy,
                    ['courseList[' + i + '].Info']: course,
                    ['courseList[' + i + '].Id']: element,
                  })
                //})(i);
              }
            })
          }(i++))
        });
        that.data.courseList.sort(function (a, b) {
          return a.Info.compareInfo - b.Info.compareInfo
        })
      }
    })

  },

  comment: function (e) {
    console.log(e.currentTarget.dataset)
    wx.setStorageSync('courseInfo', e.currentTarget.dataset.info)
    wx.setStorageSync('courseId', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../teacher/form_textarea'
    })
  },

  upload: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function (e) {
    console.log(e)
    this.setData({
      hiddenmodalput: true
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