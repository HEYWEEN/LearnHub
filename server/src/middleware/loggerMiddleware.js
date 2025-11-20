import LOG_COLOR from "../constants/logColor.js";
function loggerMiddleware(req, res, next) {
    const start = new Date();
    res.on('finish', () => {
        const duration =  new Date() - start;
        console.log(LOG_COLOR.FG_YELLOW+'[log]',LOG_COLOR.RESET+`${req.method} ${req.originalUrl} ${res.statusCode}  - ${duration}ms - IP(${req.ip})`);
    });
    next();
}

export default loggerMiddleware;