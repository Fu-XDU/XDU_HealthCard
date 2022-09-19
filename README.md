# 西电健康卡（疫情通）/晨午晚检自动提交微信小程序

​	本小程序用于西安电子科技大学健康卡（疫情通）和晨午晚检的自动提交。小程序的理念是在不妨碍疫情防控的前提下，为大部分处于安全区的同学提供便捷的自动提交服务。

## 进程

✅ 基本信息的输入与解析

✅ 信息的提交

✅ 建立数据库

✅ 编写云函数和触发器

❌ 小程序上线

> 小程序将不会上线，如有需求，请自行构建项目使用。

## 数据提交

小程序将会提交如下数据：

健康卡（疫情通）：

+ 学号：你的学号
+ 位置：你选择的位置
+ 所在地点：中国大陆
+ 今日是否在校：否
+ 今日是否在中高风险地区：否
+ 今日体温范围：36℃~36.5℃
+ 今日是否出现发热等症状：否
+ 今日是否接触风险人群：否
+ 今日是否接触密接人员：否
+ 今日是否接触境外人员：否
+ 是否有任何与疫情相关的情况：否

晨午晚检：

+ 学号：你的学号
+ 位置：你选择的位置
+ 所在地点：中国大陆
+ 是否在校：是
+ 今日体温范围：36℃~36.5℃
+ 今日西安“一码通”颜色：A 绿色
+ 是否处于隔离期：否
+ 是否出现乏力、干咳、呼吸困难等症状：否

## 截图

![Screenshot-light](./READMEImgs/screenshot-light.png#gh-light-mode-only)

![Screenshot-dark](./READMEImgs/screenshot-dark.png#gh-dark-mode-only)


## 免责声明

​	您应该对使用本程序的结果自行承担风险。开发者不做任何形式的保证：不保证服务结果满足您的要求，不保证提交服务不中断，不保证提交结果的安全性、正确性、及时性、合法性。因网络状况、通讯线路、第三方网站等任何原因而导致您不能正常使用本程序，开发者不承担任何法律责任。

​	程序尊重并保护所有使用此程序用户的个人隐私权，您输入的学号、密码等个人资料，非经您亲自许可或根据相关法律、法规的强制性规定，程序不会主动地泄露给第三方或用于此程序功能以外的服务。

## 构建项目

​	本项目已完全移除云开发依赖。小程序与服务器直接交互。

​	服务端二进制文件位于[releases](https://github.com/Fu-XDU/XDU_HealthCard/releases)页。

### 服务端说明

​	服务端可配置项如下

```bash
GLOBAL OPTIONS:
   --port value, -p value  Server port (default: "1423") [$SERVER_PORT]
   --appid value           Appid [$APPID]
   --secret value          App secret [$SECRET]
   --hmacSecret value      Hmac secret, a random string [$HMAC_SECRET]
   --mapApiKey value       Map api key [$MAP_API_KEY]
   --mysqlHost value       Mysql host (default: "127.0.0.1") [$MYSQL_HOST]
   --mysqlPort value       Mysql port (default: 3306) [$MYSQL_PORT]
   --mysqlUser value       Mysql user (default: "root") [$MYSQL_USER]
   --mysqlPasswd value     Mysql password (default: "123456") [$MYSQL_PASSWD]
   --mysqlDB value         Mysql database (default: "xdu_health_card") [$MYSQL_DB]
   --help, -h              show help
   --version, -v           print the version
```

​	其中，`port`为选填外，其他均必填。

​	mapApiKey的获取方法：前往[腾讯位置服务](https://lbs.qq.com/)，登录并进入控制台，点击`应用管理->我的应用->创建应用`创建一个应用。然后点击`添加key`，启用产品选择微信小程序并填入你的`AppID`，拿到key，即为mapApiKey。同时选中WebServiceAPI选项，但是不填写任何内容。

### 客户端说明

​	请修改[./miniprogram/utils/api.js](https://github.com/Fu-XDU/XDU_HealthCard/tree/main/miniprogram/utils/api.js#L1)第一行以确保小程序正常连接服务端。
