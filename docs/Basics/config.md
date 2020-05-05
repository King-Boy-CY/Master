# 快速开始
1.首先需要安装node.js,进入下方链接,点击下载( download ),选择对应的安装包( .msi ),下载完毕按提示一直下一步即可。
``` bash
http://nodejs.cn/
```
> 检测是否安装成功 打开CMD,输入 node-v, 如下有版本号则安装成功。
``` bash
C:\Users\Administrator>node -v
v12.14.1
```
##### 2.安装淘宝镜像
> 打开CMD 复制以下命令安装即可 ( 安装依赖则为cnpm替代"npm" )
```
 npm install -g cnpm --registry=https://registry.npm.taobao.org
```
##### 3.安装SVN
> 打开如下链接,点击tab选项卡中的"Downloads" 下载对应的安装包,根据提示下一步即可。
```
https://tortoisesvn.net/
```
svn配置中文: [图文配置入口](https://blog.csdn.net/fightsyj/article/details/88830168)

> 拉取项目：右键svn检出(svnCheckout) url : ( https://192.168.59.11/svn/prj_ich4/trunk/InterConnectBilling ),
第一次拉取的话会弹出登陆窗口, 输入移动这边给的SVN账号密码即可。

**4. 项目路径**
```
Code\icbsfront\vue-ts-admin
```
**5. 安装项目所需依赖 ( CMD进入项目根目录执行 )**
```
cnpm install
```
**6. 项目启动( 项目根目录执行 )**
```
npm run serve
```
**7. 项目打包( 项目根目录执行 )**
```
npm run build
```
**8. 技术文档路径**
```
Code\icbsfront\vue-ts-admin\docs
```

**9. 技术文档依赖( 技术文档根目录执行 )**
```
cpm i docsify-cli -g
```

**10. 技术文档启动( 技术文档根目录执行 )**
```
docsify serve
```



