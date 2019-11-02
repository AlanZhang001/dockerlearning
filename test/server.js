/**
 * node ./test/server.js
 */

const UserAgent = require('koa-useragent');
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router')
const staticServe = require('koa-static');
const logger = require('koa-logger');
const path = require('path');
const exec = require('child_process').exec;
// 配置路由
let router = new Router();

router.post('/query1', async (ctx)=> {
    let result = {
        code: 0,
        message: ''
    };
    ctx.body = result;
}).post('/query2', async(ctx) => {
    let result = {
        code: 0,
        message: ''
    };
    ctx.body = result;
}).get('/get1', async(ctx) => {
    let result = {
        code: 0,
        message: ''
    };
    ctx.body = result;
});

// 静态资源目录对于相对入口文件server.js的路径
const staticPath = path.join(__dirname, '../');
// 装载路由
app.use(logger())
    .use(UserAgent)
    .use(router.routes())
    .use(router.allowedMethods())
    .use(staticServe(staticPath, {
        index: 'index.html'
    }));

// 启动server并打开默认链接
app.listen(3000, () => {
    let openType = process.argv[3];
    let url = 'http://localhost:3000/test/index.html';
    // 如果有传入第三个字段且为examples，则打开demo
    if (openType === 'example') {
        url = 'http://localhost:3000/example/index.html';
        exec('opener ' + url, function(err, stdout, stderr) {
            console.log(stdout);
        });

    }
    console.log('start on http://localhost:3000');
});
