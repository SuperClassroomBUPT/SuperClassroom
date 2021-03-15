#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

#define PIXELPIN 10

#include <SoftwareSerial.h>
SoftwareSerial blt(12, 13);
//102RXD接收13TXD发送

int a = 200;
int b = 100;
//两个亮度
//震动
#define vib_i  11
#define vib_o  10
//声音
#define snd_i  A3
#define snd_o  8
//识别
#define l  7
#define m  6
#define r  5
//环境光
#define lit_i  A3
#define lit_o  9//首个LED连接单片机的引脚号

Adafruit_NeoPixel strip = Adafruit_NeoPixel(16, lit_o, NEO_GRB + NEO_KHZ800);

void setup()
{
  Serial.begin(9600);
  strip.begin();
  blt.begin(9600);
  Serial.println("蓝牙模块就绪");

  //震动
  pinMode(vib_i, INPUT);
  pinMode(vib_o, OUTPUT);
  //环境光
  pinMode(lit_o, OUTPUT);
  //识别
  pinMode(r, OUTPUT); /*右*/
  pinMode(m, OUTPUT); /*中*/
  pinMode(l, OUTPUT); /*左*/

}
void loop()
{
  //震动
  if (digitalRead(vib_i))
  {
    digitalWrite(vib_o, LOW);
  }
  else
  {
    digitalWrite(vib_o, HIGH);
    delay(100);
  }

  //环境光
  int n = analogRead(lit_i);
  Serial.println(n);
  //  if (n >= a ) {
  //    digitalWrite(lit_o, HIGH);
  //  } else if (n <= b) {
  //    digitalWrite(lit_o, LOW);
  //    //delay(100);
  //  } else {
  //    digitalWrite(lit_o, HIGH);
  //    delay(1);
  //    digitalWrite(lit_o, LOW);
  //    delay(1);
  //  }

  strip.setPixelColor(2, strip.Color(0, 255, 255));
  strip.show();


  //声音
  int i = analogRead(A0);
  if (i > 100) {
    digitalWrite(snd_o, HIGH);
  }
  else {
    digitalWrite(snd_o, LOW);
  }
  delay(100);



  //识别
  if (blt.available() > 0) {
    int a = blt.read();
    Serial.println(a);
    blt.println("data received");
  }

}
