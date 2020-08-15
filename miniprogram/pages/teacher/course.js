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
    hiddenmodalput: true,
    meetingNum: "",
    courseInfo:{},
    courseId:""
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
        /**
         * console.log(res.data[0].course)
         * let courseid = res.data[0].course
         * let course = new Array(courseid.length)
         * for (let i = 0; i < courseid.length; i++) {
         * db.collection('course').where({
         * _id: courseid[i]
         * }).get({
         * success: res => {
         * course[i] = res.data[0]
         * }
         * })
         * }
         * console.log(course)
         * }
      */
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
                } 
                if (!course.meetingInfo.flag) {
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
                      //console.log("month", course.dateInfo.month, "i=", i)
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
        console.log(that.data.courseList)
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

  upload: function (e) {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
    this.data.courseInfo = e.currentTarget.dataset.info
    this.data.courseId = e.currentTarget.dataset.id
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
    this.data.courseInfo = {}
    this,data.courseId = ""
  },
  //确认
  confirm: function () {
    console.log(this.data.meetingNum)
    this.data.courseInfo.meetingInfo.num = this.data.meetingNum
    this.data.courseInfo.meetingInfo.flag = true
    this.setData({
      hiddenmodalput: true
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addComment',
      data: {
          id: this.data.courseId,
          course: this.data.courseInfo
      },
      success: res => {
          wx.showToast({
              title: 'Successful！',
              duration: 2000
          })
          wx.navigateTo({
              url: '../teacher/course'
          })
      },
      fail: err => {
          wx.showToast({
              title: 'Please try again',
              duration: 2000
          })
          console.error("wx.getSetting调用失败", err.errMsg)
      }
  })
    this.data.meetingNum = ""
  },

  input: function(e) {
    this.data.meetingNum = e.detail.value
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