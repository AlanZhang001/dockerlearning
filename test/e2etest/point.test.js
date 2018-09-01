var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var util = webdriver.until;
var test = require('selenium-webdriver/testing');
var path = require('path');
var currentFilePath = __filename;
var expect = require('chai').expect;

var browsers = ['chrome','firefox','internet explorer'];

browsers.forEach(browser=>{

    test.describe('npm-example组件UI测试,' + browser + '浏览器', function() {
        this.timeout(30000);
        var driver;

        test.before(function() {
            driver = new webdriver.Builder().forBrowser(browser).usingServer('http://localhost:4444/wd/hub').build();
        });

        test.it('UI测试1', function(done) {
            driver.get('http://localhost:3000/test/e2etest/index.html');
            done();
        });

        test.it('UI测试2', function(done) {
            driver.get('http://localhost:3000/test/e2etest/index.html');
            done();
        });

        test.after(function() {
            driver.quit();
        });
    });
});
