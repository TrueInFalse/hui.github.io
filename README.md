# yanhui.github.io
$ git clone git@github.com:username/username.github.com.git 
//本地如果无远程代码，先做这步，不然就忽略
$ cd .ssh/username.github.com //定位到你blog的目录下
$ git pull origin master 
//先同步远程文件，后面的参数会自动连接你远程的文件
$ git status //查看本地自己修改了多少文件
$ git add . //添加远程不存在的git文件
$ git commit * -m "what I want told to someone"
$ git push origin master //更新到远程服务器上
