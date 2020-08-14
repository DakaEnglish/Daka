Page({
    data: {
        teacherid:"",
        openid:""
    },

    bindFormSubmit: function(e) {
      console.log(e.detail.value.textarea)
      try {
           let value = wx.getStorageSync('courseInfo')
           this.setData({
               teacherid: value.teacherid,
               openid: value.openid
           })
      } catch (error) {
          console.log("获取失败",error)
      }
      let textarea = e.detail.value.textarea
    }

  })