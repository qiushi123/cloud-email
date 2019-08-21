// pages/index/index.js
Page({
  sendEmail() {
    wx.cloud.callFunction({
      name: "sendEmail",
      success(res) {
        console.log("发送成功", res)
      },
      fail(res) {
        console.log("发送失败", res)
      }
    })
  }
})