#include <SoftwareSerial.h>          //库文件
#include <Adafruit_NeoPixel.h>
SoftwareSerial BT(8, 9);           //设置蓝牙与板子的连接端口。  pin 8  接蓝牙的 TXD    pin 9 接蓝牙的 RXD
int X;                              //定义一个变量存数据。
const int l  = 7, m  = 6, r  = 5;

Adafruit_NeoPixel stripl = Adafruit_NeoPixel(10, l, NEO_GRB + NEO_KHZ800); //l
Adafruit_NeoPixel stripm = Adafruit_NeoPixel(10, m, NEO_GRB + NEO_KHZ800); //m
Adafruit_NeoPixel stripr = Adafruit_NeoPixel(10, r, NEO_GRB + NEO_KHZ800); //r

void setup() {
  stripl.begin(); stripm.begin(); stripr.begin();
  stripl.clear(); stripm.clear(); stripr.clear();
  Serial.begin(38400);//串口监视器通信速率，38400
  BT.begin(38400);                  //蓝牙通信速率
  Serial.println("蓝牙连接正常");     //串口监视器显示蓝牙正常状态
  pinMode(r, OUTPUT); pinMode(m, OUTPUT); pinMode(l, OUTPUT);//识别
  for (int i = 1; i <= 10; i++) {
    stripl.setPixelColor(i, stripl.Color(255, 255, 255));
    stripm.setPixelColor(i, stripm.Color(255, 255, 255));
    stripr.setPixelColor(i, stripr.Color(255, 255, 255));
  }
  stripl.show(); stripm.show(); stripr.show();//三条灯全亮

}
void loop()                         //大循环，执行。
{
  if (Serial.available())           //检测：【串口】如果数据写入，则执行。
  {
    X = Serial.read();              //把写入的数据给到自定义变量  X
    BT.print(X);                    //把数据给蓝牙
  }     
  //识别
  if (BT.available() > 0)                   //检测：【蓝牙】如果数据写入，则执行。
  {
    unsigned int a[3] = {BT.read()};        //把检测到的数据给到自定义变量 a
    for(int i=0;i<3;i++)
    {Serial.println(a[i]);};                //把从蓝牙得到的数据显示到串口监视器
    BT.println("data received");
  }
//        switch (a[0]) 
//        {
//          case 4:
//            break;
//          case 3:
//            break;
//          case 2:
//            break;
//          case 1:
//            break;
//          case 0:
//            break;
//        }
//  }
//  //4~255,3~128,2^64,1~32,0~0
//  //a[0]*(255/4)
//  stripl.setBrightness(0); stripm.setBrightness(200);  stripr.setBrightness(255);
//  stripl.show(); stripm.show(); stripr.show();
}
