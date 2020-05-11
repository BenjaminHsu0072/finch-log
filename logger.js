"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var finch_tools_1 = require("finch-tools");
var fs = require('fs');
var path = require('path');
var flogColor;
(function (flogColor) {
    flogColor[flogColor["green"] = 0] = "green";
    flogColor[flogColor["red"] = 1] = "red";
    flogColor[flogColor["yellow"] = 2] = "yellow";
    flogColor[flogColor["yellowBG"] = 3] = "yellowBG";
    flogColor[flogColor["redBG"] = 4] = "redBG";
})(flogColor || (flogColor = {}));
exports.flogColor = flogColor;
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
var flog = /** @class */ (function () {
    function flog() {
        this.maxCount = 10000;
        this.maxLogFiles = 500;
        this.logDir = "./log";
        this.newLog = true;
        this.currentWriteStream = undefined;
        this.count = 0;
    }
    flog.prototype.flog = function () {
    };
    flog.prototype.delLog = function () {
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
    flog.prototype.log = function (message, color) {
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
            console.log(paint(tp, flogColor.yellow) + " : " + paint(message, color));
            this.count++;
            if (this.count > this.maxCount) {
                this.currentWriteStream.end();
                this.newLog = true;
                this.count = 0;
            }
        }
    };
    return flog;
}());
exports.flog = flog;
