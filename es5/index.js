"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//----------------具有构造函数的组件示例----------------------------------------

/**
 * xxx组件，用于干啥干啥
 * @author alanzhang <alanzhang001@qq.com>
 * @example
 * var exeample1 = new Example();
 * var exeample2 = new Example();
 * var exeample3 = new Example();
 */
var Example =
/**
 * 内部构造函数
 * @constructor
 * @param {Object} option 必选，用户传过来的配置
 * @param {String} option.name 必选，名称
 * @param {String} [option.age] 可选，年龄
 * @return {Object} 组件实例
 */
function Example(options) {
  (0, _classCallCheck3.default)(this, Example);
};

exports.default = Example;
// /*
// //----------------静态方法工具类组件实例----------------------------------------
//
// /**
//  * @author alanzhang <alanzhang001@qq.com>
//  * @author alanzhang <alanzhang001@qq.com>
//  * @module Example
//  */
// export {
//     sayHello as sayHello,
//     sayWorld as sayWorld
// };
//
// /**
//  * [sayHello description]
//  * @return {[type]} [description]
//  */
// function sayHello(){
//
// }
// /**
//  * [sayWorld description]
//  * @return {[type]} [description]
//  */
// function sayWorld(){
//
// }

module.exports = exports["default"];
