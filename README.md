# VeryFirstRepository
我在GitHub上的第一个Repository



# 项目：**智能教室灯光调节**

## 1 简介



这是一个用**微信小程序**与**arduino**开发的**智能灯光系统**！



## 2 创意过程



本项目灵感来源于市面上已有的智能灯光系统，例如下面的家庭智能灯光调节。

> 同类产品：家庭智能灯光调节
>
> 家里使用了智能灯光调节之后，在开灯时，灯光由暗渐渐变亮。关灯时，灯光由亮渐渐变暗，避免亮度的突然变化刺激人眼，给人眼一个缓冲，保护眼睛。而且避免大电流和高温的突变对灯丝的冲击，保护灯泡，延长使用寿命。还有在家里各个房间，在不同的环境之下，比如享受音乐带来的舒适，还有品尝美酒的时候，都是可以根据自身的需求来进行灯光调节的，从而创造出更为和谐而舒适的灯光。



身为学生，我们对学生群体深有了解

> 学生几乎有一半的时间在学校度过，学校也成为了学生们的第二个家。在学校的时间中又有几乎六分之五的时间是坐在教室中，而且学生大部分都是在低头看书学习，据统计，一名重点高中的学生每天在教室的时间高达6-8小时。这也说明对于教室而言，照明问题不容忽视。
>
> 然而，到了2020年，我国5岁-15岁群体近视患病率将达到77.42%，16岁-24岁群体近视患病率将达到94%。我国儿童青少年近视患病率居高不下，会降低我国未来的人口素质与国民健康素质，将对国家社会、经济甚至国家安全都产生重大影响。



遗憾的是，市面上的产品中很少，甚至于没有为**学校、教室环境**量身定制的。虽然家庭智能灯光调节也可以保护人眼，但家庭的环境较为封闭，没有室内灯光与太阳自然光的结合。而且家庭是不存在投影和黑板的切换问题，也没有课堂发言情况。

所以教室灯光调节可能更加智能，处理的情况更多，功能更多。为此，我们设计了**智能教室灯光调节**。



## 3 用户分析



用户主要为**学生**，学生的主要特点是视力问题较容易恶化和课堂投入和课堂质量不高，智能灯光调节不仅可以保护学生的视力，保持学生健康，还可以调动课堂气氛，使学生对课堂更加投入。最后还可以让学生更清楚得看到老师在投影中的ppt和写在黑板上的板书。

智能教室灯光调节不仅是要解决学生视力问题，还要通过对灯光的调节来**提升课堂教学质量**。现在的课堂教学都是黑板和投影结合的方式上课，投影仪在屏幕前灯光打开时，会出现反光现象，黑板关闭灯光时会看不清老师在黑板上写的板书，因此提升课堂教学质量就需要频繁切换灯光。若灯光开关离讲台较远则需要教室或学生离开讲台或座位关灯，较为麻烦。因此我们使用智能灯光调节，可以随时切换灯光，让黑板和投影的字体更清楚，提高教学课堂质量。

其次，**课堂上的发言**是课堂必不可少的一个环节，所以，提高课堂教学质量，充分使用智能灯光和课堂发言的结合是一个方式。因为现在发言效果普遍不高和学生发言举手的积极性不高，智能灯光可以汇聚到发言人身上，提高发言质量，并且可以用灯光随机点名，提高学生举手发言的积极性。从而提高课堂质量。

最后，现在学校用电也是一大问题，学生走后，教室内的灯依然常亮的现象时有发生，所以节约用电是一大重要学校问题。智能灯光调节不仅能把没有人的教室的灯关掉，而且还可以在上课时把没有学生的地方的灯光调暗，做到**节约用电**的效果。

 

##  4 场景分析



目标用户的使用路径可能是这样的：

1. `同学陆续进入教室——人数增加、开灯——配合投影、黑板多次打开关闭前灯——发言——下课，出教室——最后同学关灯`

2. `教室进教室上课——交替使用黑板、投影——叫同学发言——下课出教室`

   

## 5 系统功能拆解



|        **核心功能**        |              技术模块              |
| :------------------------: | :--------------------------------: |
| 根据自然光、环境光调节灯光 |         光敏电阻、led灯等          |
|    灯管与发言、声音配合    |             声音传感器             |
|   灯光与投影仪、黑板配合   |             振动传感器             |
|          模式切换          |     蓝牙模块、云数据库、小程序     |
|    根据座位分布调节灯光    | 压力传感器、图像识别、自动感应灯具 |
|          温度调节          |  小程序、温度传感器、加热制冷装置  |



## 6 功能实现



源代码在这里：

https://github.com/naive0409/VeryFirstRepository



|          核心功能          |                技术模块                 |
| :------------------------: | :-------------------------------------: |
| 根据自然光、环境光调节灯光 |             光敏电阻、led灯             |
|    灯管与发言、声音配合    |               声音传感器                |
|   灯光与投影仪、黑板配合   |               振动传感器                |
|    根据座位分布调节灯光    | 小程序、图像识别（腾讯云api）、蓝牙模块 |
|          温度调节          |    小程序、温度传感器、加热制冷装置     |



## 7项目演示

https://www.bilibili.com/video/BV1kp4y1z7rz/


