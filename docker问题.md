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

#### 3. docker 服务挂了

问题：还不清楚为什么会导致docker挂掉
解决：service docker restart

#### 4. docker 启动restart gitlab-runner 失败

问题： 在docker 服务重启后，需要重启gitlab-runner，但是可能存在报错
```
# docker restart gitlab-runner
Error response from daemon: Cannot restart container gitlab-runner: Error getting container 26da68bd90c7b4be5099dfaab9b943b48cac419bcc80d7279741019acd065a57 from driver devicemapper: Error mounting '/dev/mapper/docker-252:16-134234667-26da68bd90c7b4be5099dfaab9b943b48cac419bcc80d7279741019acd065a57' on '/data/docker/data/devicemapper/mnt/26da68bd90c7b4be5099dfaab9b943b48cac419bcc80d7279741019acd065a57': device or resource busy
```
解决办法：umount 掉on 后面的设备，`umount /data/docker/data/devicemapper/mnt/26da68bd90c7b4be5099dfaab9b943b48cac419bcc80d7279741019acd065a57`

##### 5. This job is in pending state and is waiting to be picked by a runner
问题：job 没有runner来pick，但是runner本身又没有接受任何job

解决办法：不断重启，我也不知道为啥，反正可以


