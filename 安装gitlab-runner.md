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
http://gitlab.futunn.com
Please enter the gitlab-ci token for this runner:
rsGibJ**********6os_F
Please enter the gitlab-ci description for this runner:
test-ci
Please enter the gitlab-ci tags for this runner (comma separated):
node,gulp
Registering runner... succeeded                     runner=rsGibJYA
Please enter the executor: ssh, docker-ssh+machine, kubernetes, docker, parallels, shell, docker-ssh, virtualbox, docker+machine:
docker
Please enter the default Docker image (e.g. ruby:2.1):
node:alpine
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```

配置
```sh
# 编辑配置文件
vi /etc/congitlab-runnerfig.toml
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
```sh
docker run  \
    # 后台运行
    -d \
    # 指定名称
    --name gitlab-runner \
    -v /var/run/docker.sock:/var/run/docker.sock  \
    # gitlab-runer的配置文件放在/etc/gitlab-runner/config.toml中，通过挂载目录的形式在外部做修改
    # 同时，以便重启或者重建后配置仍然生效
    -v /data/gitlab-runner/config:/etc/gitlab-runner  \
    # 用于executor内解析gitlab.futunn.com 域名
    --add-host gitlab.futunn.com:172.24.22.100 \
    # gitlab-runner镜像版本
    gitlab/gitlab-runner:latest 

```

### config.toml配置详解
```sh
#
concurrent = 4
check_interval = 3
log_level = "debug"
[session_server]
  session_timeout = 1800

[[runners]]
  name = "172.24.16.51"
  url = "http://gitlab.futunn.com"
  token = "4qnxsy-mm5X2r2BZ8ypX"
  executor = "docker"
  request_concurrency = 4
  limit = 4
  [runners.docker]
    tls_verify = false
    image = "node:alpine"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    extra_hosts = ["gitlab.futunn.com:172.24.22.100","webstaticresource-10000538.cos.ap-shanghai.myqcloud.com:123.206.239.100","registry.npm.oa.com:172.24.22.71", "walle.oa.com:172.28.6.10", "apitest.server.com:172.24.22.11"]
    pull_policy = "if-not-present"
    disable_cache = false
    volumes = ["/data/gitlab-runner/builds:/builds:rw", "/data/gitlab-runner/cache:/cache:rw"]
    shm_size = 0
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
```
