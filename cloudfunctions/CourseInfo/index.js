// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "courseselect-pyznx"
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    const id = await db.collection("course").add({
      data: {
        course: event.courseInfo
      },
      success: res=>{
        return res._id
      },
      fail: err=>{
        return err
      }
    })
    return {
      event,
      id,
      test: "test"
    }
}