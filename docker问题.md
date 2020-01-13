# docker常见问题

#### 1. docker image pull  gitlab/gitlab-runner:lastest安装不成功

问题：提示Error response from daemon: manifest for gitlab/gitlab-runner:lastest not found: manifest unknown: manifest unknown
解决办法：docker image pull  gitlab/gitlab-runner，默认使用lastest的tag

#### 2. ping not found

问题：进入某个容器中，没有ping命令
解决办法：
```shell
apt-get update
apt-get install iputils-ping
```
