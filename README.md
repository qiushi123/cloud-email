> 上一节给大家讲了借助小程序云开发的云函数管理mysql数据库，这一节，就来给大家讲一讲使用云开发云函数实现邮件发送的功能。

老规矩，先看效果图
![](https://upload-images.jianshu.io/upload_images/6273713-b0c9a311a191011f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
通过上面的日志，可以看出我们是158的邮箱给250的邮箱发送邮件，下面是成功接收到的邮件。
![](https://upload-images.jianshu.io/upload_images/6273713-a50d9f603705eca6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 准备工作
- 1，qq邮箱一个
- 2，开通你的qq邮箱的授权码（会具体讲解）
- 3，注册自己的小程序（因为只有注册的小程序才能使用云开发）
- 4，电脑要安装node(会用到npm命令行)
- 5，跟着老师编写小程序代码

# 一，准备一个qq邮箱，并启动SMTP服务
这个我不做具体讲解了。你进入你的qq邮箱以后，
### 1，点击设置，然后点击账户
![](https://upload-images.jianshu.io/upload_images/6273713-70284ec8e1fc7ff8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 2，开启POP3/SMTP服务，获取授权码。
![](https://upload-images.jianshu.io/upload_images/6273713-8339cd760cbacfe8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
具体操作可以看官方文档，官方文档有具体的讲解，这里我就不多说了。
官方文档：https://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28
我们获取的授权码如下图。这个授权码，我们后面发送邮件时会用到。
![](https://upload-images.jianshu.io/upload_images/6273713-3c7d37f086014756.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 二，注册小程序获取appid，创建一个小程序。
关于小程序的注册，和创建小程序我就不在做具体讲解，感兴趣的同学或者还不会的同学可以翻看我前面的文章学习，也可以看我的零基础入门小程序的视频：[https://edu.csdn.net/course/detail/9531](https://edu.csdn.net/course/detail/9531)
下图是我们创建好的小程序。
![](https://upload-images.jianshu.io/upload_images/6273713-73f30a59ace52c0a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
代码很简单，就只有一个页面，页面上就一个按钮，我们点击这个按钮的时候实现邮件的发送。

# 三，初始化云开发，创建发送邮件的云函数。
关于云开发初始化我这里也不在做具体讲解了，感兴趣或者不会的同学，可以去看我录制的云开发入门视频：[https://edu.csdn.net/course/detail/9604](https://edu.csdn.net/course/detail/9604)

#### 初始化云开发环境时，有下面几点注意事项给大家说下。
1，一定要是注册的小程序有appid才可以使用云开发
2，一定要在app.js里初始化云开发环境id
![](https://upload-images.jianshu.io/upload_images/6273713-3832b2aefe15eae4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3，在project.config.json里配置云函数目录，如下图箭头所示
![](https://upload-images.jianshu.io/upload_images/6273713-07b67f3a89e6c7fa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 四，创建云函数 sendEmail
1，右键cloud文件，新建云函数
![](https://upload-images.jianshu.io/upload_images/6273713-69215855d13e9d8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个函数名你可以随便起，只要是英文，并且调用的时候记得不要写错就行。我这里就用sendEmail
2，创建完以后，右键sendEmail选择在终端里打开
![](https://upload-images.jianshu.io/upload_images/6273713-16df77ae28c090ef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这里我们需要用npm安装一个依赖包 nodemailer 使用npm安装依赖包需要用到node，至于node的安装大家自行百度，一大堆的讲解文章。
3，在打开的命令行窗口里输入 npm install nodemailer
![](https://upload-images.jianshu.io/upload_images/6273713-4ee562b83151dfc2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4，等待 nodemailer类库的安装。
![](https://upload-images.jianshu.io/upload_images/6273713-fb5f314d85bec022.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
5，安装成功时，您能看到nodemailer的版本号。
![](https://upload-images.jianshu.io/upload_images/6273713-3479ef7acb7cec09.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 五，编写发送邮件的核心代码。
这里一定要注意填写你自己的qq邮箱的授权码
![](https://upload-images.jianshu.io/upload_images/6273713-17f3347366713703.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
代码里都有注释，直接把代码给大家贴出来吧。
```
const cloud = require('wx-server-sdk')
cloud.init()
//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com', //网易163邮箱 smtp.163.com
  port: 465, //网易邮箱端口 25
  auth: {
    user: '1587072557@qq.com', //邮箱账号
    pass: '这里要填你自己的授权码' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async(event, context) => {
  // 创建一个邮件对象
  var mail = {
    // 发件人
    from: '来自小石头 <1587072557@qq.com>',
    // 主题
    subject: '来自小石头的问候',
    // 收件人
    to: '2501902696@qq.com',
    // 邮件内容，text或者html格式
    text: '你好啊，编程小石头' //可以是链接，也可以是验证码
  };

  let res = await transporter.sendMail(mail);
  return res;
}
```

# 六，上传云函数
编写完代码后，一定要记得上传云函数
![](https://upload-images.jianshu.io/upload_images/6273713-7008de27ffa70e96.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 七，调用云函数发送邮件
我们在index.wxml文件里写一个按钮，当点击这个按钮时就发送邮件。
![](https://upload-images.jianshu.io/upload_images/6273713-bfbee4ac65caac99.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
然后在index.js里调用我们的sendEmail云函数。
![image.png](https://upload-images.jianshu.io/upload_images/6273713-5d31566ed22c5afe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 八，点击发送邮件，查看效果。
可以看到我们的控制台，打印里发送成功的日志信息
![](https://upload-images.jianshu.io/upload_images/6273713-1054802ce945e52f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
然后到我们的邮箱里，可以看到新收到的邮件。
![](https://upload-images.jianshu.io/upload_images/6273713-3fbd427b4c31fbb2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

到这里我们就完整的实现了微信小程序云开发使用云函数发送邮件的功能了。是不是很简单呢。

大家先试着自己敲下，看能不能实现，如果实现不了再下载源码。

有任何关于小程序相关的问题，也可以加我微信 2501902696（备注小程序）








