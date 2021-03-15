//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      Url : "https://636c-cloud-1ga5cv35f871c6b0-1303849977.tcb.qcloud.la/detect/detect.png?sign=a4b96c0f754c1f9de0f969724dfbf929&t=1607522459",

      //用于图像识别的图片url

      v: false //是否使用拍摄的的图片
    }
  }
})