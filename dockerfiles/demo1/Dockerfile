# 以base作为基础镜像，安装一个项目
FROM base
COPY . /app
WORKDIR /app
RUN git clone https://github.com/AlanZhang001/dockerlearning.git
RUN cd /app/dockerlearning && npm install
EXPOSE 3000
cmd cd /app/dockerlearning && npm rum serverstart


# 运行
# docker image build -t demo1 .
# docker container run -p 8000:3000 -it demo1
# 访问http://localhost:8000/example/
