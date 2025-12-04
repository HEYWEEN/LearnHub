import LOG_COLOR from "../constants/logColor.js";
import { prettyJSON } from "../utils/logUtils.js";
function loggerMiddleware(req, res, next) {
  const start = new Date();
  res.on("finish", () => {
    const duration = new Date() - start;
    if(global.detailedLogging) {
      console.log(
        LOG_COLOR.FG_YELLOW + "[log]",
        LOG_COLOR.RESET +
          `${req.method} ${req.originalUrl} ${res.statusCode}  - ${duration}ms - IP(${req.ip})\n`
          +LOG_COLOR.FG_YELLOW + `Query: ${JSON.stringify(req.query)}\n` 
          + `Params: ${prettyJSON(req.params)}\n`
          + `Headers: ${prettyJSON(req.headers)}\n`
          + `Body: ${prettyJSON(req.body)}\n`+ LOG_COLOR.RESET

      );
      return;
    }
    console.log(
      LOG_COLOR.FG_YELLOW + "[log]",
      LOG_COLOR.RESET +
        `${req.method} ${req.originalUrl} ${res.statusCode}  - ${duration}ms - IP(${req.ip})`
    );
  });
  next();
}

export default loggerMiddleware;
