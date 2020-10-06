// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "courseselect-1gu1y8qx28c4bb88"
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await db.collection("user").where({
      _openid: event.openid
    }).update({
      data: {
        course: _.push({
          each: [
            event.courseInfo
          ],
          sort: {
            compareInfo: 1,
          }
        }),
        courseid: _.push(
            event.courseid)
      }
    })
    try {
      await db.collection("teacher").where({
        _id: event.id
      }).update({
        data: {
          course: _.push({
            each: [
              event.courseid
            ],
            sort: {
              compareInfo: 1,
            }
          })
        }
      })
    } catch (error) {
      console.error(error)
    }
  } catch (error) {
    console.error(error)
  }
  
  return {
    data: event
  }
}