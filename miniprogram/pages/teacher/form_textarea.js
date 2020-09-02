Page({
    data: {
        course: {},
        id: ""
    },

    bindFormSubmit: function (e) {
        let that = this
        console.log(e.detail.value.textarea)
        try {
            let value1 = wx.getStorageSync('courseInfo')
            let value2 = wx.getStorageSync('courseId')
            console.log(value1, value2)
            this.setData({
                course: value1,
                id: value2
            })
        } catch (error) {
            console.log("获取失败", error)
        }
        let textarea = e.detail.value.textarea
        this.data.course.comment = {
            flag: true,
            text: textarea
        }
        console.log("***",this.data.id, this.data.course)
        wx.cloud.callFunction({
            // 云函数名称
            name: 'addComment',
            data: {
                id: this.data.id,
                course: this.data.course
            },
            success: res => {
                wx.showToast({
                    title: 'Successful！',
                    duration: 2000
                })
                wx.removeStorageSync('courseId')
                wx.removeStorageSync('courseInfo')
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
    }

})