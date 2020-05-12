// 云函数入口文件
const cloud = require('wx-server-sdk')
 
cloud.init({
  env: "courseselect-pyznx"
})
 
const db = cloud.database()
 
// 云函数入口函数
exports.main = async (event, context) => {
  const teacherCollection = db.collection('teacher')
  return await teacherCollection.where({
      _id: event._id
  }).update({
    data:{
      'freetimeTable': event.freetime
    }
  })
}