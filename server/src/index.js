import app from './app.js';

const PORT = process.env.PORT || 4004;

import LOG_COLOR from './constants/logColor.js';
console.log(
LOG_COLOR.BG_YELLOW+"///////////////////////////////////////////////////////////////"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                          _ooOoo_                          //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                         o8888888o                         //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                         88\" . \"88                         //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                         (| ^_^ |)                         //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                         O\\  =  /O                         //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                      ____/`---'\\____                      //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                    .'  \\\\|     |//  `.                    //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                   /  \\\\|||  :  |||//  \\                   //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                  /  _||||| -:- |||||-  \\                  //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                  |   | \\\\\\  -  /// |   |                  //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                  | \\_|  ''\\---/''  |   |                  //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                  \\  .-\\__  `-`  ___/-. /                  //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                ___`. .'  /--.--\\  `. . ___                //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//               .\"\" '<  `.___\\_<|>_/___.'  >'\"\".            //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//            | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |            //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//            \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /            //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//     ========`-.____`-.___\\_____/___.-`____.-'========     //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//                          `=---='                          //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^     //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"//           佛祖保佑       永不宕机     永无BUG             //"+LOG_COLOR.RESET+'\n'+
LOG_COLOR.BG_YELLOW+"///////////////////////////////////////////////////////////////"+LOG_COLOR.RESET+'\n');

app.listen(PORT, () => {
    console.log(LOG_COLOR.FG_BLUE + `LearnHub API is listening at http://localhost:${PORT}` + LOG_COLOR.RESET);
});





