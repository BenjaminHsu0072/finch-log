import {getReadableDate} from "finch-tools";

const fs = require('fs');
const path = require('path');

/***
 * 定义可绘制的颜色
 */
enum finchLogColor {
    green,
    red,
    yellow,
    yellowBG,
    redBG
}

/***
 * 绘制颜色的方法
 * @param message 原始信息
 * @param color 增加颜色后的信息
 */
function paint(message: string, color?: finchLogColor): string {
    let logColorStyler = [
        ['\x1B[32m', '\x1B[39m'],
        ['\x1B[31m', '\x1B[39m'],
        ['\x1B[33m', '\x1B[39m'],
        ['\x1B[43m', '\x1B[49m'],
        ['\x1B[41m', '\x1B[49m']
    ];
    if (color !== undefined) {
        return logColorStyler[color][0] + message + logColorStyler[color][1] + " ";
    } else return message;
}


class finchLog {

    public maxLinesInLogFile:number = 2000;
    public maxLogFiles:number = 500;
    public logDir = "./log";

    public newLog = true;
    public currentWriteStream = undefined;
    public count = 0;

    //如果日志总数大于之前设定的日志，则删除多的文件
    private delLog() {
        if (!fs.existsSync(this.logDir)) {
            return;
        }
        let list = fs.readdirSync(this.logDir);
        while (list.length > this.maxLogFiles) {
            let f = null;
            for (let a in list) {
                if (path.extname(list[a]) === '.txt') {
                    f = list[a];
                    fs.unlinkSync(path.join(this.logDir, f));
                    break;
                }
            }
            list = fs.readdirSync(this.logDir);
        }
    }

    /**
     * 日志API
     * @param message 信息
     * @param color 颜色（可选）
     */
    public log(message: string, color?: finchLogColor) {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
        let tp = getReadableDate();
        if (this.newLog) {
            this.delLog();
            this.currentWriteStream = fs.createWriteStream(path.join(this.logDir, tp + ".txt"), {flags: 'a'});
            this.newLog = false;
        }
        if (this.currentWriteStream) {
            let theInfo = tp + ' : ' + message;
            this.currentWriteStream.write(theInfo + '\r\n');
            console.log(paint(tp, finchLogColor.yellow) + " : " + paint(message, color));
            this.count++;
            if (this.count > this.maxLinesInLogFile) {
                this.currentWriteStream.end();
                this.newLog = true;
                this.count = 0;
            }
        }
    }
}

export {finchLog, finchLogColor};