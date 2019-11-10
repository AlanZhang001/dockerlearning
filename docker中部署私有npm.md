## 学习一下搭建私有npm

## 可以用的部署方案

目前，比较多的是 采用cnpmjs或sinopia进行私有npm的部署，两者最大的不同是，sinopia部署简单一些，但是支持的功能没有cnpmjs强大。自己实践时，也是实践cnpmjs

## 下载并运行docker
搭建私有npm需要linux环境，使用docker是成本最低的选择，同时迁移非常方便。

docker的下载及安装见<https://github.com/AlanZhang001/dockerlearning>

## 定制自己的dockerfile

cnpmjs是完善的系统，我们需要根据自己的环境做自定义，然后根据其提供的模板dockerfile build一个镜像用于部署。

#### 1、本地 clone cnpmjs.org至本地

```shell
cd ~/github
git clone https://github.com/cnpm/cnpmjs.org.git
cd cnpmjs.org
```

#### 2、参看cnpmjs.org/下的Dockerfile

这个dockerfile就是要用于生成镜像的file

```shell
## 引用node镜像
FROM node:12

MAINTAINER Bono Lv <lvscar  {aT} gmail.com>

# Working enviroment:工作环境变量
# CNPM_DIR这个目录，在docker中会用来存放cnpmjs.org项目的文件
# CNPM_DATA_DIR 没懂干啥
ENV \
    CNPM_DIR="/var/app/cnpmjs.org" \
    CNPM_DATA_DIR="/var/data/cnpm_data"

# 创建上面的目录
RUN mkdir  -p ${CNPM_DIR}

# 指定接下来的工作路径，类似于cd命令
WORKDIR ${CNPM_DIR}

# 将cnpmjs.org项目的package.json 拷贝至CNPM_DIR
COPY package.json ${CNPM_DIR}

# 设置源，用于加快速度
RUN npm set registry https://registry.npm.taobao.org

# 安装依赖，不包括devDependencies
RUN npm install --production

# 将cnpmjs.org项目的文件拷贝至CNPM_DIR，包括node_modules
COPY .  ${CNPM_DIR}
COPY docs/dockerize/config.js  ${CNPM_DIR}/config/

# 开放7001和7002端口,外部可以通过 其他端口映射到这2个端口
EXPOSE 7001/tcp 7002/tcp


VOLUME ["/var/data/cnpm_data"]

# Entrypoint
# 容器启动以后执行的命令
CMD ["node", "dispatch.js"]


```

## 运行linux

这里搭建了一个包含centos，git，node的基镜像。
这样进入docker的centos环境
```shell
# 1.下载
docker pull alanzhang001/base:1.0.0
# 2 启动centos
# 使用该privileged参数，container内的root拥有真正的root权限。否则，container内的root只是外部的一个普通用户权限。
docker container run -it --privileged=true alanzhang001/base:1.0.0  /bin/bash
# 2.1退出后如何启动
docker container start [containerid]
docker container exec -it [containerID] /bin/bash
```

## 安装mysql
```shell
# 0. 安装几个必要的软件
yum install wget
yum install sudo

# 1 安装rpm：软件包的管理工具
wget https://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm
# 2
sudo rpm -ivh mysql57-community-release-el7-9.noarch.rpm
# 3. install MySQL server:
sudo yum install mysql-server
# 4. start
sudo systemctl start mysqld
```

## 参考
- centeos上安装mysql：<https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7>
- https://kwokronny.github.io/201907/docker-cnpm-devlop/
- https://github.com/cnpm/cnpmjs.org/wiki/Deploy
