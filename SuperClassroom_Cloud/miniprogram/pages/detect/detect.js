// miniprogram/pages/detect/detect.js
var app = getApp();

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}
// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({
  data:{
    SecretId : "AKIDBexFSTPNFxviK0ktRmax75sVsRtEOoBQ",
    SecretKey : "JPJxPg1Vq591gUG2CBJDrOiQwEOHvc7P",
    Nonce:"",//随机数，用于请求APIxxxxxxxxxxxxxxxxxxxxxxxxxx
    times:"",//unix timestamp，用于请求API
            //图片的Url存在app.js的globalData里

    //下面是识别结果，左中右各有多少个人
    left:"",
    mid:"",
    right:"",
    detArray:[],

    //控制识别开始和停止
    start:false,

    devices: [],
    connected: false,
    chs: [],
  },


  onLoad: function () {
    var that = this
    setInterval(function(){

      //循环执行
      if(that.data.start){
        //start控制是否拍照&识别
        that.takePhoto()
        setTimeout(function () {
          //拍照到获得地址需要一定时间。如果不设置延时在调api时将无法获取url。
          that.API()//调用api
         }, 3000)//延迟时间
      }
    }, 3000)
  },

  switch:function(){
    //console.log(this.data.start)

    //改变start的值
    if(this.data.start){
      this.setData({
        start : false
      })
    }else{
      this.setData({
        start : true
      })
    }
    //console.log(this.data.start)
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
          cloudPath:'detect/detect'+that.data.times+'.png',
          filePath:res.tempImagePath, // 文件路径
          success:res => {
            console.log("成功拍照并上传")
            //获取图片url用于人体识别
            var array = [res.fileID]
            console.log("array",array)
            wx.cloud.getTempFileURL({//这个函数通过FileId来获取图片的Url
              fileList:array,//用数组来输入fileId
              success:function(res){
                //url传到globaldata
                app.globalData.Url  = res.fileList[0].tempFileURL
                console.log("刚刚拍摄的图片",app.globalData.Url)
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


  },

  
  API:function(){
    /**********************api文档************************
    https://cloud.tencent.com/document/product/1208/42972
    *****************************************************/

    //生成用于计算signature的字符串,然后调腾讯云人体识别api
    //signature是鉴权参数
    var data = this.data
    var app = getApp()
    var Nonce = Math.floor(Math.random()*100000)//Nonce随机数
    var times = (Date.parse(new Date()))/1000//当前时间
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
        //console.log(res.data.Response.Error)
        console.log("res.data",res.data)
         //console.log("返回：",res.data.Response.BodyDetectResults)//成功则返回识别结果
        //console.log(res.data.Response.BodyDetectResults.nv_length)
            that.cal(res.data.Response.BodyDetectResults)
      },
      fail:function(res){
        console.log("fail",res)
      }
    })
  },
  cal:function(arr){
    //console.log("arr",arr);
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
      right:x[2],
      detArray:x
    })
    console.log("l,m,r",this.data.left,this.data.mid,this.data.right)
    console.log("detarray",this.data.detArray)
    // console.log("arrx",arrx)
    // console.log("arry",arry)
  },

    //下面是蓝牙部分
  openBluetoothAdapter() {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        console.log('getBluetoothAdapterState', res)
        if (res.discovering) {
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          this.startBluetoothDevicesDiscovery()
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
    })
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },
  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        this.getBLEDeviceServices(deviceId)
      }
    })
    this.stopBluetoothDevicesDiscovery()
  },
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },
  getBLEDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary && res.services[i].uuid === '0000FFE0-0000-1000-8000-00805F9B34FB') {//CHANGED
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            })
          }
          if (item.properties.write) {
            this.setData({
              canWrite: true
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            this.writeBLECharacteristicValue()
          }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
        data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      }
      // data[`chs[${this.data.chs.length}]`] = {
      //   uuid: characteristic.characteristicId,
      //   value: ab2hex(characteristic.value)
      // }
      this.setData(data)
    })
  },
  writeBLECharacteristicValue() {
    var datax = [this.data.left,this.data.mid,this.data.right]
    var buffer = new ArrayBuffer(datax.length)
    var dataView = new DataView(buffer)
    datax.forEach(function (item, index) {
      dataView.setUint8(index, item)})

    // 向蓝牙设备发送一个0x00的16进制数据
    // let buffer = this.data.detArray//detarray
    // let dataView = new DataView(buffer)
    // dataView.setUint8(0, Math.random() * 255 | 0)//写入随机数
    wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: buffer,
      success(res){//CHANGED
        console.log('writeBLECharacteristicValue success',res)
      },
      fail:function(res){
        console.log("失败",res)
      }
    })
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },

})
