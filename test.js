"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var logger = new index_1.finchLog();
logger.maxLogFiles = 10;
logger.maxLinesInLogFile = 500;
logger.log("hahahah", index_1.finchLogColor.green);
logger.log("hahahah", index_1.finchLogColor.yellowBG);
