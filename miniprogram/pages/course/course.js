
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: null,
    todayEmpty: 0,
    bookTimeEmpty: 0,
    passTimeEmpty: 0,
    showOneButtonDialog: false,
    meetingNum: "",
    dialogShow: false,
    id: "",
    teacher: "",
    time: "",
    courseid: [],
    teacherid: ""
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
    this.data.courseList = []
    try {
      let value = wx.getStorageSync('user')
      var id = value._openid
    } catch (e) {
      console.log("调用失败", e)
    }
    console.log("userid:", id)
    db.collection('user').where({
      _openid: id
    }).get({
      success: res => {
        //console.log(res.data[0].courseid)
        let courseid = res.data[0].courseid
        that.data.courseid = courseid
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
                date.setTime(date.getTime() + 70 * 60 * 60 * 1000);
                //console.log(date)
                let month = date.getMonth()
                let day = date.getDate()
                let year = date.getFullYear()
                let date1 = new Date()
                let month1 = date1.getMonth()
                let day1 = date1.getDate()
                let year1 = date1.getFullYear()
                //console.log(year, month, day)
                //(function (i) {
                //console.log(course)
                let week = course.dateInfo.week
                let toweek = that.changeweek(week)
                let totime = course.time
                let teacherid = course.teacherid
                let meetingNumFlag = course.meetingInfo.flag
                let toTeacherCommentFlag = course.toTeacherComment.flag
                //console.log("Date:", course.dateInfo, i)
                if (course.dateInfo.day < day1 && course.dateInfo.month == month1 + 1 ||
                  course.dateInfo.month < month1 + 1 && course.dateInfo.year == year1 ||
                  course.dateInfo.year < year1) {
                  //教师评价过的课程(相当于已上课程)
                  that.setData({
                    passTimeEmpty: 1,
                    ['courseList[' + i + '].type']: 0,
                    ['courseList[' + i + '].dropType']: false,
                  })
                  if(course.comment.flag){
                    that.setData({
                      ['courseList[' + i + '].commentType']: true
                    })
                  }
                } else if (course.dateInfo.day == day1 && course.dateInfo.month == month1 + 1) {
                  //今日课程，可查会议号
                  that.setData({
                    todayEmpty: 1,
                    ['courseList[' + i + '].type']: 1,
                    ['courseList[' + i + '].numFlag']: meetingNumFlag,
                    ['courseList[' + i + '].dropType']: false,
                  })
                  //console.log(that.data.todayEmpty)
                } else if (course.dateInfo.day < day && course.dateInfo.month == month + 1 ||
                  course.dateInfo.month < month + 1 && course.dateInfo.year == year ||
                  course.dateInfo.year < year) {
                  //2天内的课程不可退课,可以查看会议号
                  console.log(course, "flag:", meetingNumFlag)
                  that.setData({
                    bookTimeEmpty: 1,
                    ['courseList[' + i + '].type']: 2,
                    ['courseList[' + i + '].numFlag']: meetingNumFlag,
                    ['courseList[' + i + '].dropType']: false,
                  })
                  //console.log(that.data.todayEmpty)
                } else {
                  //2天外的课程可退课
                  that.setData({
                    bookTimeEmpty: 1,
                    ['courseList[' + i + '].dropType']: true,
                    ['courseList[' + i + '].type']: 2,
                    ['courseList[' + i + '].numFlag']: false
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
                      //console.log("**name:", that.data.courseList)
                    }
                  }),
                  //console.log("!!!!!!!!!!!",toweek)
                  //console.log("!!!!!!!!!!!",totime)
                  that.setData({
                    ['courseList[' + i + '].dateInfo']: course.dateInfo,
                    ['courseList[' + i + '].teacherid']: course.teacherid,
                    ['courseList[' + i + '].week']: toweek,
                    ['courseList[' + i + '].time']: totime,
                    ['courseList[' + i + '].Info']: course,
                    ['courseList[' + i + '].Id']: element,
                    ['courseList[' + i + '].TComment']: toTeacherCommentFlag,
                  })
                //console.log(that.data.courseList)
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

  changeweek: function (week) {
    if (week == 1) return "星期一";
    if (week == 2) return "星期二";
    if (week == 3) return "星期三";
    if (week == 4) return "星期四";
    if (week == 5) return "星期五";
    if (week == 6) return "星期六";
    if (week == 7) return "星期日";
  },

  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },

  /**
   * 弹窗会议号
   */
  MeetingNum: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.id)
    db.collection('course').where({
      _id: e.currentTarget.dataset.id
    }).get({
      success: res => {
        that.setData({
          meetingNum: res.data[0].course.meetingInfo.num
        })
      },
      fail: err => {
        that.setData({
          meetingNum: "出现错误，请重试！"
        })
        console.error("出现错误", err)
      }
    })
    this.setData({
      showOneButtonDialog: true
    })
  },

  /**
   * 弹窗确认
   */
  dropClass: function (e) {
    console.log(e.currentTarget.dataset)
    this.data.id = e.currentTarget.dataset.id
    this.data.teacherid = e.currentTarget.dataset.teacherid
    this.setData({
      dialogShow: true,
      teacher: e.currentTarget.dataset.teacher,
      time: e.currentTarget.dataset.time,
    })
  },

  confirm: function () {
    let that = this
    let courseid = this.data.courseid
    let id = this.data.id
    let teacherid = this.data.teacherid
    //console.log("id:", id, "courseid", courseid, courseid.indexOf(id))
    let n = courseid.indexOf(id)
    //console.log(id,n)
    if (n == -1) return -1
      this.freeTimeTable(courseid[n])
      courseid.splice(n, 1)
      //console.log(courseid)
      db.collection('user').where({
        _openid: app.globalData.userid
      }).update({
        data: {
          courseid: courseid,
          courseTimes: _.inc(+1)
        },
        success: function (res) {
          wx.cloud.callFunction({
            // 云函数名称
            name: 'delete',
            data: {
              id: id,
              teacherid: teacherid,
              courseid: courseid
            },
            success: res => {
              wx.showToast({
                title: '退课成功！',
                duration: 2000
              })
              that.setData({
                dialogShow: false,
                courseList: null,
                bookTimeEmpty: 0,
              })
              
              that.onShow()
            },
            fail: err => {
              wx.showToast({
                title: '退课失败，请重试！',
                duration: 2000
              })
              console.error("修改失败", err)
            }
          })
        }
      })
  },

  //修改教师空余时间
  freeTimeTable: function (courseid) {
    let that = this
    console.log("正在修改教师时间", courseid)
    //本周单数周or双数周
    let week = this.getWeek() % 2;
    db.collection('course').where({
      _id: courseid
    }).get({
      success: res => {
        //console.log(res.data[0])
        let day = res.data[0].course.dateInfo.week
        let time = that.stringToNum(res.data[0].course.time)
        let teacherid = res.data[0].course.teacherid
        console.log(week, day, time)
        db.collection('teacher').where({
          _id: teacherid
        }).get({
          success: res => {
            let freetime = res.data[0].freetime
            freetime[week][day - 1][time].available = true
            freetime[week][day - 1][time].studentOpenId = ""
            //console.log(freetime)
            wx.cloud.callFunction({
              // 云函数名称
              name: 'updateTeacherFreetime',
              data: {
                _id: teacherid,
                freetime: freetime
              },
              success(res) {
                console.log("调用成功")
              },
              fail(res) {
                console.log("调用失败", res)
              }
            })
          },
        })
      },
    })
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

  //转化时间-id
  stringToNum: function (name) {
    if (name == "8:00-8:30") return 0
    if (name == "8:30-9:00") return 1
    if (name == "9:00-9:30") return 2
    if (name == "9:30-10:00") return 3
    if (name == "10:00-10:30") return 4
    if (name == "10:30-11:00") return 5
    if (name == "11:00-11:30") return 6
    if (name == "11:30-12:00") return 7
    if (name == "14:00-14:30") return 8
    if (name == "14:30-15:00") return 9
    if (name == "15:00-15:30") return 10
    if (name == "15:30-16:00") return 11
    if (name == "16:00-16:30") return 12
    if (name == "16:30-17:00") return 13
    if (name == "17:00-17:30") return 14
    if (name == "17:30-18:00") return 15
    if (name == "18:00-18:30") return 16
    if (name == "18:30-19:00") return 17
    if (name == "19:00-19:30") return 18
    if (name == "19:30-20:00") return 19
    if (name == "20:00-20:30") return 20
    if (name == "20:30-21:00") return 21
  },

  teacherComment: function(e) {
    console.log(e.currentTarget)
    let tmp ={
      id: e.currentTarget.dataset.id,
      teacher: e.currentTarget.dataset.teacher
    }
    wx.setStorageSync('tmp', tmp)
    wx.navigateTo({
      url: '/pages/course/comment',
    })
  }
})