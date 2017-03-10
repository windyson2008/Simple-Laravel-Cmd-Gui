##Simple Lavael Cmd Gui
公司电脑没有权限设置环境变量，每次都 `Set Path` 很烦
要么就得写一大堆 `bat` 文件
正好学习 `Node` 桌面开发，练手练手。

### 下载安装
请确保安装了 [@NodeJS](https://nodejs.org/) 环境
```
git clone  https://github.com/windyson2008/simple-laravel-cmd-gui.git
cd simple-laravel-cmd-gui
npm install && start
```

### 依赖
* Node.js
* [@ElectronJS](https://electron.atom.io)
* [@ZUI](http://zui.sexy/)

### 使用
* 设置环境变量
![slcg1](https://github.com/windyson2008/MyWarehouse/raw/master/slcg-1.PNG)

* 点击按钮执行命令
![slcg2](https://github.com/windyson2008/MyWarehouse/raw/master/slcg-2.PNG)

* 目前没做动态生成命令的组件，请自行修改 config/config.json 下 commands 命令集
![slcg3](https://github.com/windyson2008/MyWarehouse/raw/master/slcg-3.PNG)

###TODO
- [ ] 界面调整
- [ ] 控件化
- [ ] 通用 Windows 工具

## License
MIT