// miniprogram/pages/detect/detect.js
var app = getApp();
Page({
  data: {
    SecretId : "你的腾讯云secretkeysecretid",
    SecretKey : "你的腾讯云secretkey",
    Nonce:"",//随机数，用于请求API
    times:"",//unix timestamp，用于请求API
    //图片的Url则存在app.js的globalData里

    //下面是识别结果，左中右各有多少个人
    left:"",
    mid:"",
    right:""
  },


  onLoad: function (options) {
    var that = this
    // setTimeout(function () {
    //   //要延时执行的代码
    //   that.API()
    //  }, 3000)
  },

  takePhoto() {
    var that = this
    const ctx = wx.createCameraContext()
    
    /***********************照相+获取url**********************/
    ctx.takePhoto({
      quality: 'medium',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })

        //把图片上传到小程序云存储并获得url
        wx.cloud.uploadFile({
          cloudPath:'detect/detect.png',
          filePath:res.tempImagePath, // 文件路径
          success:res => {
            console.log("成功拍照并上传")
            //获取图片url用于人体识别
            var array = [res.fileID]
            wx.cloud.getTempFileURL({//这个函数通过FileId来获取图片的Url
              fileList:array,//用数组来输入fileId
              success:function(res){
                //url传到globaldata

                // if(app.globalData.v){
                  //v控制参数，见app.js
                app.globalData.Url  = res.fileList[0].tempFileURL
                console.log("urllllll",app.globalData.Url)
              // }
              }
            })
          },
          fail: err => {
            console.log("上传失败")
          }
        })
        //把图片上传到小程序云存储并获得url*

      },
      fail:function(res){
        console.log("拍摄照片失败")
      }
    })
    /*********************照相+获取url 结束***********************/

    setTimeout(function () {//拍照到获得地址需要一定时间。如果不设置延时在调api时将无法获取url。
      //要延时执行的代码
      that.API()
     }, 3000) //延迟时间 这里是2秒
  },

  
  API:function(){

    /**********************api文档************************

    https://cloud.tencent.com/document/product/1208/42972

    *****************************************************/

    //生成用于计算signature的字符串,然后调腾讯云人体识别api
    //signature是鉴权参数
    var data = this.data
    var app = getApp()
    var Nonce = Math.floor(Math.random()*100000)
    var times = (Date.parse(new Date()))/1000
    this.setData({
      Nonce:Nonce,
      times:times
    })

    //生成str字符串，用于计算signature
    var str = "GETbda.tencentcloudapi.com/?Action=DetectBody&MaxBodyNum=10&Nonce="+Nonce+"&Region=ap-beijing&SecretId="+this.data.SecretId+"&Timestamp="+times+"&Url="+app.globalData.Url+"&Version=2020-03-24"
    //console.log("str",str)


    //计算signature （引用cryptojs，对str进行HmacSHA1和Base64计算）
    const cryptojs = require('crypto-js')
    var wordarrayResult = cryptojs.HmacSHA1(str,data.SecretKey)
    var sign = cryptojs.enc.Base64.stringify(wordarrayResult)
    var that = this

    //调用腾讯云人体识别API
    wx.request({

      url: "https://bda.tencentcloudapi.com",
      header: {
        "Content-Type": "application/json"
      },
      method:"GET",
      data:{
        Action:"DetectBody",
        MaxBodyNum:10,
        Nonce:Nonce,
        Region:"ap-beijing",
        SecretId:this.data.SecretId,
        Signature:sign,
        Timestamp:times,
        Url:app.globalData.Url,
        Version:"2020-03-24",
      },
      success: function(res) {
        console.log(res.data.Response.Error)
         console.log("返回：",res.data.Response.BodyDetectResults)//成功则返回识别结果
        //console.log(res.data.Response.BodyDetectResults.nv_length)
            that.cal(res.data.Response.BodyDetectResults)
      },
      fail:function(res){
        console.log("fail",res)
      }
    })
  },
  cal:function(arr){
    // console.log("arr",arr);
    var arrx= new Array(arr.nv_length);
    var arry= new Array(arr.nv_length);
    var   x = new Array(0,0,0)
    //将识别结果中人的位置(x,y)导入到本地数组arrx,arry中，
    //并求位置与图片尺寸之比
    for(var i = 0;i<arr.nv_length;i++)
    {
      arrx[i]=arr[i].BodyRect.X
      arrx[i]/=1080 //宽1080
      arry[i]=arr[i].BodyRect.Y
      //arry[i]/=900  //高900
    }
    for(var i = 0; i<arrx.nv_length ;i++){
      if      (arrx[i]<1/3) x[0]++
      else if (arrx[i]<2/3) x[1]++
      else if (arrx[i]< 1 ) x[2]++

      // if      (arry[i]<1/2) y[0]++
      // else if (arry[i]< 1 ) y[2]++
    }
    this.setData({
      left:x[0],
      mid:x[1],
      right:x[2]
    })

    console.log(this.data.left,this.data.mid,this.data.right)
    // console.log("arrx",arrx)
    // console.log("arry",arry)
  }

})