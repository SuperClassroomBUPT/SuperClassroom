#include <Adafruit_NeoPixel.h>
#include <SoftwareSerial.h>
SoftwareSerial blt(0, 1);

unsigned long oldtime = 0;
const int vib_i =  11, vib_o = 10;//震动
#define snd_ia  A1//声音
const int snd_id = 4, snd_o  = 8;
const int l  = 7, m  = 6, r  = 5;
#define lit_i  A0//环境光
const int lit_o  = 3;

Adafruit_NeoPixel stripl = Adafruit_NeoPixel(10, l, NEO_GRB + NEO_KHZ800); //l
Adafruit_NeoPixel stripm = Adafruit_NeoPixel(10, m, NEO_GRB + NEO_KHZ800); //m
Adafruit_NeoPixel stripr = Adafruit_NeoPixel(10, r, NEO_GRB + NEO_KHZ800); //r

void setup() {
  Serial.begin(9600);
  stripl.begin(); stripm.begin(); stripr.begin();
  stripl.clear(); stripm.clear(); stripr.clear();
  blt.begin(9600); Serial.println("蓝牙模块就绪");
  pinMode(vib_i, INPUT); pinMode(vib_o, OUTPUT);//震动
  pinMode(snd_ia, INPUT); pinMode(snd_id, INPUT); pinMode(snd_o, OUTPUT); //声音
  pinMode(lit_o, OUTPUT);//环境光
  pinMode(r, OUTPUT); pinMode(m, OUTPUT); pinMode(l, OUTPUT);//识别
  for (int i = 1; i <= 10; i++) {
    stripl.setPixelColor(i, stripl.Color(255, 255, 255));
    stripm.setPixelColor(i, stripm.Color(255, 255, 255));
    stripr.setPixelColor(i, stripr.Color(255, 255, 255));
  }
  stripl.show(); stripm.show(); stripr.show();//三条灯全亮

}

void loop() {
  //震动
  float _vibin = digitalRead(vib_i);
  //Serial.println(_vibin);
  if (!_vibin) {
   // digitalWrite(vib_o, HIGH);
    stripm.setBrightness(255);
    stripm.show();
  }

  if (millis() - oldtime > 5000) {
    oldtime = millis(); //更新时间点
    digitalWrite(vib_o, LOW);
    stripm.setBrightness(1);
    stripm.show();
    stripr.setBrightness(64); stripr.show();
  }


  //环境光//由于只有两条灯带，此项暂时被禁用
  float _litin = analogRead(lit_i);
  //Serial.println(_litin);
  int lit = abs(  (_litin - 500) * 0.25 );//亮度输出
  //analogWrite(lit_o, lit);
  //stripr.setBrightness(lit); stripr.show();


  //声音
      int _sndin = analogRead(snd_ia);
      //int _sndin = digitalRead(snd_id);
      Serial.println(_sndin);
      if (_sndin > 390) {
        digitalWrite(snd_o, HIGH);
        stripr.setBrightness(255); stripr.show();
      }
      else {
        digitalWrite(snd_o, LOW);
      }
    //  delay(100);
  //识别
  if (blt.available() > 0) {
    unsigned int a = blt.read();
    //Serial.println(a);
    //blt.println("data received");
    //    switch (a) {
    //      case 4:
    //        break;
    //      case 3:
    //        break;
    //      case 2:
    //        break;
    //      case 1:
    //        break;
    //      case 0:
    //        break;
    //    }
  }
  //4~255,3~128,2^64,1~32,0~0
  //a[0]*(255/4)
  //stripl.setBrightness(0); stripm.setBrightness(200);  stripr.setBrightness(255);
  //stripl.show(); stripm.show(); stripr.show();
}
