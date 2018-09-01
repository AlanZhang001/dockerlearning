var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var fs = require('fs');
var path = require('path');
var browsers = ['chrome','firefox','internet explorer'];

browsers.forEach(browser=>{
    test.describe('npm-example组件单元测试,' + browser + '浏览器', function() {
        this.timeout(25000);
        var driver;

        test.before(function() {
            driver = new webdriver.Builder().forBrowser(browser).usingServer('http://localhost:4444/wd/hub').build();
        });
        test.it('lib库中方法测试',function(){
            driver.get('http://localhost:3000/test/unittest/index.html');
        });

        test.after(function() {
            // 保存单元测试结果
            driver.executeScript('return "<html>" + document.querySelector("head").outerHTML + "<body>" + document.querySelector("#mocha").outerHTML  + "</body>" + "</html>"').then((innerhtml)=> {
                var p = path.resolve(process.cwd() + '\\test\\unittest');
                !fs.existsSync(p) && fs.mkdirSync(p);
                var htmlPath = path.join(p, `${browser}.html`);
                console.log(`\t\t${browser}浏览器单元测试结果：${path.normalize(htmlPath)}`);
                fs.writeFile(htmlPath, innerhtml, function(err) {});
            });
            driver.wait(driver.quit(), 3000);
        });
    });
});
