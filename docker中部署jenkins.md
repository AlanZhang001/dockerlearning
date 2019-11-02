## docker 中部署jenkins

#### 安装jenkins

```shell

# 1. 可以查找docker hub上发布的jenkins镜像，选择比较新的 jenkins/jenkins 镜像，等会安装，先知道这个命令
docker search jenkins

# 2. 创建一个本地目录，可用于在docker容器中挂载，简单理解为共享目录
mkdir /Users/$(whoami)/jenkins_home

# 3. 通过docker 安装jenkins
# -v: 表示把我们新建的jenkins_home目录映射到容器的/var/jenkins_home目录，注意，本地的目录路径需要是一个绝对路径
# -p: 端口映射，容器的 8080 端口映射到本机的 8081 端口。容器的 50000 端口映射到本机的 50000 端口。
# jenkins/jenkins:lts： 是我们刚刚search到的image
# 注意：这一步不要使用-d(后台运行模式)
docker run --name jenkins_node  -v /Users/$(whoami)/jenkins_home:/var/jenkins_home -p 8081:8080 -p 50000:50000 jenkins/jenkins:lts
# waiting....
# log会告诉你 启动成功 ：Started ServerConnector@380fb434{HTTP/1.1,[http/1.1]}{0.0.0.0:8080}
# .....
# Jenkins is fully up and running

# 4. 访问 http://localhost:8081/,会提示你在/var/jenkins_home/secrets/initialAdminPassword中有密码
# 根据3中的-v字段，可以知道，/var/jenkins_home/secrets/initialAdminPassword
# 在本地就是 /Users/$(whoami)/jenkins_home/secrets/initialAdminPassword
# 拿到密码登陆后台
cat /Users/$(whoami)/jenkins_home/secrets/initialAdminPassword


```
