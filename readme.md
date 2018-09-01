# 学一下docker

#### 一些记录

- 安装：[mac](https://store.docker.com/editions/community/docker-ce-desktop-mac)
- 启动docker：直接点击docker图标
- docker 切换image源看这里：[Docker Hub 源使用帮助
](https://mirrors.ustc.edu.cn/help/dockerhub.html)
- 一些命令

```
# 列出本机的所有 image 文件。
docker image ls

# 删除 image 文件
docker image rm [imageName]

# 将 image 文件从仓库抓取到本地
# 由于 Docker 官方提供的 image 文件，都放在library组里面，所以它的是默认组，可以省略
docker image pull library/[imageName]

# 从 image 文件，生成一个正在运行的容器实例
# docker container run命令具有自动抓取 image 文件的功能。如果发现本地没有指定的 image 文件，就会从仓库自动抓取。
# 因此，前面的docker image pull命令并不是必需的步骤。
docker container run hello-world

# 列出本机正在运行的容器
docker container ls
或者docker ps

# 列出本机所有容器，包括终止运行的容器
docker container ls --all
或者docker ps -a

#终止运行的容器文件，依然会占据硬盘空间，可以使用docker container rm命令删除。
docker container rm [containerID]

#终止容器运行
docker container kill [containerID]

#启动已经生成、已经停止运行的容器文件
docker container start [containerID]

#终止容器运行
bash container stop [containerID]

#进入一个正在运行的 docker 容器
# 如果docker run命令运行容器的时候，没有使用-it参数或者执行的一个命令不是/bin/bash，就要用这个命令进入容器。一旦进入了容器，就可以在容器的 Shell 执行命令了
docker container exec -it [containerID] /bin/bash
```

#### 创建image

以<https://github.com/AlanZhang001/dockerlearning>为例：

##### 1. 准备源码

```
git clone https://github.com/AlanZhang001/dockerlearning
cd dockerlearning
```

##### 2. 创建.dockerignore
指定创建dockerfile时需要排除的文件路径

```
# 创建文件
touch .dockerignore
# 指定路径
# 如果你没有路径要排除，这个文件可以不新建。
.git
node_modules
npm-debug.log
.idea
```
##### 3. 创建dockerfile

```
# 创建文件
touch Dockerfile
# 写入内容
FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
```

- `FROM node:8.4`：该 image 文件继承官方的 node image，冒号表示标签，这里标签是8.4，即8.4版本的 node。
- `COPY . /app`：将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
- `WORKDIR /app`：指定接下来的工作路径为/app。
- `RUN npm install`：在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入 image 文件。
- `EXPOSE 3000`：将容器 3000 端口暴露出来， 允许外部连接这个端口。dockerlearning启动时需要访问8000端口

##### 4. 创建image文件
```
docker image build -t dockerlearning .
# 或者
docker image build -t dockerlearning:0.0.1 .
```

- -t参数用来指定 image 文件的名字，后面还可以用冒号指定标签。如果不指定，默认的标签就是latest
- 最后的那个点表示 Dockerfile 文件所在的路径，上例是当前路径，所以是一个点。
- `docker image ls`查看是否有新生成的image文件,至此，image文件生成成功

##### 5. 利用image文件生成容器

```
docker container run -p 8000:3000 -it dockerlearning /bin/bash
#或则
docker container run -p 8000:3000 -it dockerlearning:0.0.1 /bin/bash
# 或者直接在容器启动之后启动node的服务
docker container run -p 8000:3000 -it dockerlearning npm run serverstart
```

- p参数：容器的 8000 端口映射到本机的 3000 端口。
- it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。
- koa-demo:0.0.1：image 文件的名字（如果有标签，还需要提供标签，默认是 latest 标签）。
- /bin/bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 Shell。
- npm run serverstart：容器启动以后，可通过这个命令来启动node 服务

#### cmd
上一节的例子里面，容器启动以后，需要手动输入命令node demos/01.js。我们可以把这个命令写在 Dockerfile 里面，这样容器启动以后，这个命令就已经执行了，不用再手动输入了。

```
FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
```

- RUN命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件
- CMD命令则是在容器启动后执行。另外，一个 Dockerfile 可以包含多个RUN命令，但是只能有一个CMD命令。

#### 一些参考资料
- [Docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
