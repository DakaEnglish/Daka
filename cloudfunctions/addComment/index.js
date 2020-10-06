// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "courseselect-1gu1y8qx28c4bb88"
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    return await db.collection("course").where({
      _id: event.id
    }).update({
      data: {
        course: event.course
      },
      success: res=>{
        return res
      },
      fail: err=>{
        return err
      }
    })
}