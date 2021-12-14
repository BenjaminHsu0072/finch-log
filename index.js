"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finchLogColor = exports.finchLog = void 0;
var finch_tools_1 = require("finch-tools");
var fs = require('fs');
var path = require('path');
/***
 * 定义可绘制的颜色
 */
var finchLogColor;
(function (finchLogColor) {
    finchLogColor[finchLogColor["green"] = 0] = "green";
    finchLogColor[finchLogColor["red"] = 1] = "red";
    finchLogColor[finchLogColor["yellow"] = 2] = "yellow";
    finchLogColor[finchLogColor["yellowBG"] = 3] = "yellowBG";
    finchLogColor[finchLogColor["redBG"] = 4] = "redBG";
})(finchLogColor || (finchLogColor = {}));
exports.finchLogColor = finchLogColor;
/***
 * 绘制颜色的方法
 * @param message 原始信息
 * @param color 增加颜色后的信息
 */
function paint(message, color) {
    var logColorStyler = [
        ['\x1B[32m', '\x1B[39m'],
        ['\x1B[31m', '\x1B[39m'],
        ['\x1B[33m', '\x1B[39m'],
        ['\x1B[43m', '\x1B[49m'],
        ['\x1B[41m', '\x1B[49m']
    ];
    if (color !== undefined) {
        return logColorStyler[color][0] + message + logColorStyler[color][1] + " ";
    }
    else
        return message;
}
var finchLog = /** @class */ (function () {
    function finchLog() {
        this.maxLinesInLogFile = 2000;
        this.maxLogFiles = 500;
        this.logDir = "./log";
        this.newLog = true;
        this.currentWriteStream = undefined;
        this.count = 0;
    }
    //如果日志总数大于之前设定的日志，则删除多的文件
    finchLog.prototype.delLog = function () {
        if (!fs.existsSync(this.logDir)) {
            return;
        }
        var list = fs.readdirSync(this.logDir);
        while (list.length > this.maxLogFiles) {
            var f = null;
            for (var a in list) {
                if (path.extname(list[a]) === '.txt') {
                    f = list[a];
                    fs.unlinkSync(path.join(this.logDir, f));
                    break;
                }
            }
            list = fs.readdirSync(this.logDir);
        }
    };
    /**
     * 日志API
     * @param message 信息
     * @param color 颜色（可选）
     */
    finchLog.prototype.log = function (message, color) {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
        var tp = finch_tools_1.getReadableDate();
        if (this.newLog) {
            this.delLog();
            this.currentWriteStream = fs.createWriteStream(path.join(this.logDir, tp + ".txt"), { flags: 'a' });
            this.newLog = false;
        }
        if (this.currentWriteStream) {
            var theInfo = tp + ' : ' + message;
            this.currentWriteStream.write(theInfo + '\r\n');
            console.log(paint(tp, finchLogColor.yellow) + " : " + paint(message, color));
            this.count++;
            if (this.count > this.maxLinesInLogFile) {
                this.currentWriteStream.end();
                this.newLog = true;
                this.count = 0;
            }
        }
    };
    return finchLog;
}());
exports.finchLog = finchLog;
