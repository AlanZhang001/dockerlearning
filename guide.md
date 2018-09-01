## 开发指引

- 源码位于src中，对外暴露的文件为es5/index.js
- 开发完成需自行 npm run build进行babel降级及打包。
- 开发完成需要自行jsdoc -c jsdocconf.json生成文档查看api文档是否符合预期。
- 如果是有功能性升级需要在test/*.test.js增加测试用例。

## package.json scritps 说明

打包脚本均通过package.json scritps进行，目前分为如下几个部分：
```
"jsdoc": 生成jsdoc文档
"babel": babel降级
"build-es5": 对降级的源码进行打包，为es5级别
"build-es5-min": 对降级的源码进行打包压缩，为es5级别
"build-es6": 对源码进行打包，为es6级别
"build-es6-min": 对源码进行打包压缩，为es6级别
"build": 集成运行以上脚本
"seleniumstart":开始selenium服务
"serverstart": 开启server服务
"pretest": 做npm install 操作,
"teststart": 做mocha测试,
"example": demo入口
"test": 测试入口脚本，开启web server服务并启动自动化测试
```

开发完成，运行`npm run build` 即可。
或者运行`gulp --gulpfile webpack.config.js`

## 自动化测试

- 开发完成之后，需要运行测试用例检测成功与否。
- 测试代码位于tests目录中，`e2etest`中为端对端测试，`unittest`为单元测试
- 运行测试用例，需安装最新的jdk，然后，在项目根目录运行如下命令

```端对端测试
npm install
npm run seleniumstart
npm run test
```
- 由于使用koa2作为后台，请保证nodejs的版本不低于7.6

