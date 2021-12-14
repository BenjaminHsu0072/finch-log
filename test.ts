import {finchLog, finchLogColor} from "./index";

let logger= new finchLog();
logger.maxLogFiles = 10;
logger.maxLinesInLogFile = 500;
logger.log("hahahah",finchLogColor.green)
logger.log("hahahah",finchLogColor.yellowBG)

