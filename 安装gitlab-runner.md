### 二进制文件安装

<https://docs.gitlab.com/runner/register/index.html#gnulinux>

安装：
```sh
# 上172.28.249.39机器

# 1. 添加GitLab的官方存储库：
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash

# 2. 查看可安装的gitlab-runner版本
yum list gitlab-runner --showduplicates | sort -r

# 3. 安装gitlab-runner，找了一个gitlab-runner-11.9.2-1的版本
sudo yum install gitlab-runner-11.9.2-1
# 提示错误：Cannot retrieve repository metadata (repomd.xml) for repository: docker-ce-stable. Please verify its path and try again
# 解决错误
vi /etc/yum.repos.d/docker-ce.repo
# 找到docker-ce-stable设置 enabled=0

# 4. 再次安装
sudo yum install gitlab-runner-11.9.2-1
# 提示(28, 'Operation too slow. Less than 1 bytes/sec transfered the last 30 seconds')
# gitlab-runner-11.9.2-1.x86_64: failure: gitlab-runner-11.9.2-1.x86_64.rpm from runner_gitlab-runner: [Errno 256] No more mirrors to try.
# 解决错误，设置timeout时间
vi /etc/yum.conf
# 添加2行配置
minrate=1
timeout=300
# 安装N次，网络缓慢，很久后成功
```

注册：

```sh
# 5. 注册
$ sudo gitlab-runner register

# 进入问答式填写，按实际情况填写
Runtime platform arch=amd64 os=linux pid=14408 revision=fa86510e version=11.9.2
Running in system-mode.

Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/):
http://gitlab.xx.com           # gitlab 的访问路径
Please enter the gitlab-ci token for this runner:
rsGibJ**********6os_F              # 在项目的settting/CICD/Runners下获取
Please enter the gitlab-ci description for this runner:
test-ci                            # runner描述，随便写
Please enter the gitlab-ci tags for this runner (comma separated):
node,gulp                          # runner的标签
Registering runner... succeeded                     runner=rsGibJYA
Please enter the executor: ssh, docker-ssh+machine, kubernetes, docker, parallels, shell, docker-ssh, virtualbox, docker+machine:
docker                             # runner的exector，一般使用docker
Please enter the default Docker image (e.g. ruby:2.1):
node:alpine                        # 使用node基础镜像
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```

配置
```sh
# 编辑配置文件
vi /etc/gitlab-runner/config.toml
# 加入这行，表示可以使用本地的镜像，而不是再远程没有获取到时报错
pull_policy = "if-not-present"
```

启动
```sh
# 如果没启动docker先启动
service docker restart
# 启动gitlab-runner
sudo gitlab-runner restart
```

### 通过docker安装

**安装**

```sh
docker run \
   `# 后台运行` \
    -d \
    `# 当 docker 重启时，容器自动启动,在容器退出时总是重启容器` \
    --restart=always \
    `# 指定名称` \
    --name gitlab-runner \
    `# 需要把docker.sock传进去，只有添加了此目录挂载，docker之中的gitlab runner才能访问到外部宿主机的docker功能。` \
    -v /var/run/docker.sock:/var/run/docker.sock  \
    `# gitlab-runer的配置文件放在/etc/gitlab-runner/config.toml中，通过挂载目录的形式在外部做修改` \
    `# 同时，以便重启或者重建后配置仍然生效` \
    -v /data/gitlab-runner/config:/etc/gitlab-runner  \
    `# 用于executor内解析gitlab.xx.com 域名` \
    --add-host gitlab.xxx.com:172.xx.xx.xx \
    `# gitlab-runner镜像版本` \
    gitlab/gitlab-runner:latest 
```

**注册**
```sh
# 要映射和Runner一样的配置文件地址
docker run --rm -it -v /data/gitlab-runner/config/:/etc/gitlab-runner gitlab/gitlab-runner register
```

**问答式填写**
```sh
Runtime platform arch=amd64 os=linux pid=7 revision=ce065b93 version=12.10.1
Running in system-mode.

Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/):
http://gitlab.xx.com/
Please enter the gitlab-ci token for this runner:
c_RUEgXDopxQjMPmyqri
Please enter the gitlab-ci description for this runner:
[267ba71b0ad2]: alanzhangmac
Please enter the gitlab-ci tags for this runner (comma separated):
node,gulp
Registering runner... succeeded                     runner=c_RUEgXD
Please enter the executor: parallels, kubernetes, shell, ssh, virtualbox, docker+machine, docker-ssh+machine, custom, docker, docker-ssh:
docker
Please enter the default Docker image (e.g. ruby:2.6):
node:alpine
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```

**config.toml配置详解**

主要添加这2个配置
```sh
extra_hosts = ["gitlab.xx.com:172.24.22.100"]
pull_policy = "if-not-present"
```

修改完成重启，`docker restart gitlab-runner`


mac上机器配置
```sh
concurrent = 1      # 可以同时运行的作业数
check_interval = 0  # 新作业检查之间的时间间隔，默认为3s，如果设置为0，则仍然默认为3
log_level = "debug" # 日志级别，定义为debug，用输出runner的所有信息

[session_server]    # 未用到
  session_timeout = 1800

[[runners]]
  name = "alanzhangmac"             # runner 名称
  url = "http://gitlab.xx.com/"     # gitlab地址
  token = "eBwTw5V9VkJFxzJzthb1"    # runner token,不是注册时的token,runner注册完成之后，gitlab返回改token给runner，runner以后每次请求携带该token
  executor = "docker"               # exector
  [runners.custom_build_dir]        # 未用到
  [runners.cache]                   # 分布式缓存，比如存在云端，未用到
    [runners.cache.s3]
    [runners.cache.gcs]
  [runners.docker]
    tls_verify = false              # 启用或禁用与Docker守护程序的连接的TLS验证. 默认禁用。配置远程连接Docker时设置
    image = "node:alpine"           # 默认的基础镜像，可以在gitlab-ci-.yml中覆盖指定的镜像
    privileged = false              # 使用该参数，container内的root拥有真正的root权限。否则，container内的root只是外部的一个普通用户权限。
    disable_entrypoint_overwrite = false  # 覆盖镜像的entrypoint指定的命令
    oom_kill_disable = false        # 如果发生内存不足错误，不要终止容器中的进程，为false表示要终止
    disable_cache = false           # 不禁用本地缓存
                                    # 配置域名解析，docker内部无法解析这些域名
    extra_hosts = ["gitlab.xx.com:172.24.22.100"]
                                    # 将Docker守护程序主机上的目录装载到容器中. 当您要将目录存储在容器外部时，此功能很有用.rw表示可读可写
                                    # /builds,/cache为runner 构建结果的目录以及cache的目录
    volumes = ["/data/gitlab-runner/builds:/builds:rw", "/data/gitlab-runner/cache:/cache:rw"]
    pull_policy = "if-not-present"  # 首先检查本地是否有所用的镜像，如果没有再尝试远程拉取，通过哦这个配置可以避免某些软件或库的频繁安装
    shm_size = 0                    # 未用到
```

51机器上完整配置示例；

```sh
# 可以同时运行的作业数
concurrent = 4
# 新作业检查之间的时间间隔，默认为3s，如果设置为0，则仍然默认为3
check_interval = 3
# 日志级别，定义为debug，用输出runner的所有信息
log_level = "debug"
[session_server]
  session_timeout = 1800

[[runners]]
  # runner 名称
  name = "172.xx.xx.xx"
  # gitlab地址
  url = "http://gitlab.xxx.com"
  # token
  token = "4qnxsy-mm5X2r2BZ8ypX"
  # executor
  executor = "docker"
  #
  request_concurrency = 4
  #
  limit = 4
  [runners.docker]
    # 启用或禁用与Docker守护程序的连接的TLS验证. 默认禁用。
    # 配置远程连接Docker时设置
    tls_verify = false
    # 基础镜像
    image = "node:alpine"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    # 配置域名解析，docker内部无法解析这些域名
    extra_hosts = ["gitlab.xx.com:172.24.xx.xx"]
    # 首先检查本地是否有所用的镜像，如果没有再尝试远程拉取，通过哦这个配置可以避免某些软件或库的频繁安装
    pull_policy = "if-not-present"
    # 不禁用本地缓存
    disable_cache = false
    volumes = ["/data/gitlab-runner/builds:/builds:rw", "/data/gitlab-runner/cache:/cache:rw"]
    shm_size = 0
    # 分布式缓存功能,暂时不会用到
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
```

**构建镜像**

node-gulp.Dockerfile
```sh
FROM node:10.18.0-alpine3.9
RUN echo "http://mirrors.ustc.edu.cn/alpine/v3.4/main/">/etc/apk/repositories
RUN apk --update add tzdata git
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" > /etc/timezone
ENV TIMEZONE Asia/Shanghai
RUN npm install gulp@3.9.1 npm@6.0.0  -g --registry=http://registry.npm.oa.com
```

构建命令

```sh
docker build -t node-gulp -f node-gulp.Dockerfile .
```

**移除某个runner**
```sh
# 先进入gitlab-runner
docker exec -it gitlab-runner /bin/bash
# 执行 unregister
gitlab-runner unregister  --config /data/gitlab-runner/config/config.toml --url http://gitlab.futunn.com --token 7c7c2651c62c470b787b75352c471d
```
