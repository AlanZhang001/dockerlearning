# 构建一个包含node 和git的基础镜像
FROM centos:7
#epel-release是扩展，必装
RUN yum install -y epel-release
RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs
RUN yum install -y git

