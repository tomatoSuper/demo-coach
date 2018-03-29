# demo-wxapp
#### 关于项目结构
```
   git clone https://github.com/tomatoSuper/demo-coach.git      // clone 代码
   cd demo-coach/       // 进入项目文件夹
   
   git status       //  查看文件状态，没有什么提示。
         do somethings....(添加文件，或者随便改一个文件)
   git status       // 查看文件状态，红字显示文件的变化提示
   git add .            // 
   git status           // 绿字显示提示。文件添加进暂存区
   git commit -m "自定义注释"            // 文件提交进本地仓库
   git pull             // push代码之前先pull下线上仓库的代码，如果有merge冲突，在本地解决merge
                        如果有merge 在处理完merge后，重新走 add  commit 脚本命令
   git push             // 将本地仓库区代码推到线上仓库
```
```
本项目使用分包加载的方案开发，项目结构规划如下
prod(小程序文件目录)

   └─BZ (宝尊团队的分包根目录)
        └─── pages (页面文件 folder)
            └─── page1
            └─── page2
            └─── .....
            
   └─components (自定义组件目录)
        └─── component Folder........ (如ben-ui中，定义了宝尊团队的小程序组件)
        
   └─config (一些配置项设置)
        └─── api(定义接口配置，内详)
        
   └─images (一些公共的小图片文件，如一些图标等)
   
   └─pages (主包的页面)
        └─── page1
        └─── page2
        └─── .....
   
   └─styles (公共的样式库文件包;)
        └─── BZ(宝尊团队的公共样式Folder; 关于命名规范宝尊团队将使用 `ben` 开头，以`-`链接，定义样式类名)
        └─── common(双方公用，共同维护的样式库，如定义全局页面的字体设置，文本设置，布局设置等)
        └─── Teein(Teein团队的公共样式Folder; 命名规范问题请在随后完善)
        
        关于页面的尺寸适配，推荐使用 `rpx` 单位。
        关于适配 iphoneX 等全面屏手机，随后双方团队可再深入讨论
            
   └─Teein (Teein团队的分包根目录)
        └─── pages (页面文件 folder)
            └─── page1
            └─── page2
            └─── .....
            
   └─utils (公共的js方法库)
        └─── BZ ( 宝尊团队与业务功能相关的方法库 )
        └─── Teein ( Teein团队与业务功能相关的方法库 )
        └─── util.js ( 公共的一些方法类库，与业务功能代码无关 )
        
   └─app.js (1. 在生命周期内执行授权登录等功能和业务方法; 2. 定义引用方法库; 3. 定义全局数据对象和属性。 详见微信小程序官方文档)
   
   └─app.json (配置页面路由、全局页头设置，tabbar等， 详见微信小程序官方文档)
   
   └─app.wxss (定义和引用全局的样式库， 详见微信小程序官方文档)
   
   └─project.config.json (详见微信小程序官方文档)
```