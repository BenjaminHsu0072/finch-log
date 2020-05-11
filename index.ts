import {getReadableDate} from "finch-tools";

const fs = require('fs');
const path = require('path');

enum flogColor {
    green,
    red,
    yellow,
    yellowBG,
    redBG
}

function paint(message: string, color?: flogColor): string {
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


class flog {
    maxCount = 10000;
    maxLogFiles = 500;
    logDir = "./log";
    newLog = true;
    currentWriteStream = undefined;
    count = 0;

    flog() {

    }

    delLog() {
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

    log(message: string, color?: flogColor) {
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
            console.log(paint(tp, flogColor.yellow) + " : " + paint(message, color));
            this.count++;
            if (this.count > this.maxCount) {
                this.currentWriteStream.end();
                this.newLog = true;
                this.count = 0;
            }
        }
    }
}

export {flog, flogColor};