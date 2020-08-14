// miniprogram/pages/teacher/teacher.js
const db = wx.cloud.database()
const teacherbase = db.collection('teacher')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checks: [[
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    [
      { name: "Mon", value: '0', checked: true },
      { name: "Tue", value: '1', checked: true },
      { name: "Wed", value: '2', checked: true },
      { name: "Thu", value: '3', checked: true },
      { name: "Fri", value: '4', checked: true },
      { name: "Sat", value: '5', checked: true },
      { name: "Sun", value: '6', checked: true },
    ],
    ],
    time: [
      {name:"8:00 9:00", value: '0'},
      {name:"9:00 10:00", value: '1'},
      {name:"10:00 11:00", value: '2'},
      {name:"11:00 12:00", value: '3'},
      {name:"14:00 15:00", value: '4'},
      {name:"15:00 16:00", value: '5'},
      {name:"16:00 17:00", value: '6'},
      {name:"17:00 18:00", value: '7'},
      {name:"18:00 19:00", value: '8'},
      {name:"19:00 20:00", value: '9'},
      {name:"20:00 21:00", value: '10'},
    ],
    teacherid: null,
    List: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    //console.log(this.data.checks)
    let that = this
    try {
      let value = wx.getStorageSync('user')
      this.setData({
        teacherid: value.teacherId
      })
      console.log(value)
    } catch (error) {
      console.error("调用失败", error)
    }
    teacherbase.where({
      _id: this.data.teacherid
    }).get({
      success: res=>{
        //本周单数周or双数周
        let week = that.getWeek()%2;
        let freetime = res.data[0].freetime[week]
        console.log("week",week,"freetime",freetime)
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 22; j+=2) {
            if(!freetime[i][j].available){
              let check = 'checks['+j/2+']'+'['+i+'].checked'
              that.setData({
                [check]: false
              })
            }
          }
        }
        //console.log(that.data.checks)
      } 
    })
  },
    
  toSetTimeTable: function(){
    let that = this
    teacherbase.where({
      _id: this.data.teacherid
    }).get({
      success: res=>{
        //本周单数周or双数周
        let week = that.getWeek()%2;
        let freetime = res.data[0].freetime[week]
        let List = res.data[0].freetime
        console.log("week",week,"freetime",freetime)
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 11; j++) {
            if(that.data.checks[j][i].checked){
              freetime[i][j*2].available = true
              freetime[i][j*2+1].available = true
            }
            else{
              freetime[i][j*2].available = false
              freetime[i][j*2+1].available = false
            }
          }
        }
        List[week] = freetime
        //console.log(List)
        that.setData({
          List: List
        })
        wx.cloud.callFunction({
          // 云函数名称
          name: 'updateTeacherFreetime',
          data: {
            _id: that.data.teacherid,
            freetime: that.data.List
          },
          success(res) {
            console.log("调用成功")
            wx.showToast({
              title: 'Set up successfully',
              duration: 2000,
              icon: 'none'
            })
          },
          fail(res) {
            console.log("调用失败",res)
          }
        })
      }
    })
  },

  clicks: function (e) {
    console.log(e.currentTarget.dataset)
    let day = e.currentTarget.dataset.day;
    let time = e.currentTarget.dataset.time;
    let arrs = this.data.checks;
    if (arrs[time][day].checked == false) {
      arrs[time][day].checked = true;
    } else {
      arrs[time][day].checked = false;
    }
    this.setData({
      checks: arrs
    })
     //console.log(this.data.checks)
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
})