import LOG_COLOR from "../constants/logColor.js";
import { exec } from "child_process";

export const checkEnvConfig = () => {
  const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  if (!process.env.SECRET_KEY) {
    console.warn(
      LOG_COLOR.FG_RED +
        "[Warning]" +
        LOG_COLOR.RESET +
        "正在使用默认的SECRET_KEY,建议在.env中设置一个强随机性的SECRET_KEY。"
    );
  }
  if (!process.env.API_KEY || !process.env.AI_URL || !process.env.AI_MODEL) {
    console.warn(
      LOG_COLOR.FG_RED +
        "[Warning]" +
        LOG_COLOR.RESET +
        "没有设置ai相关环境变量(API_KEY、AI_URL、AI_MODEL),无法启用相关功能"
    );
    console.warn(process.env.API_KEY, process.env.AI_URL, process.env.AI_MODEL);
  }
  if (missingVars.length > 0) {
    console.error(
      LOG_COLOR.FG_RED + "[err]" + LOG_COLOR.RESET + "缺少必要的环境变量:",
      missingVars
    );
    return false;
  }
  return true;
};

export const checkFFmpeg = async () => {
  const check = (cmd) =>
    new Promise((resolve) => {
      exec(`${cmd} -version`, (err) => resolve(!err));
    });

  const hasFFmpeg = await check("ffmpeg");
  const hasFFprobe = await check("ffprobe");
  const FFMPEG_STATUS = {
    enabled: hasFFmpeg && hasFFprobe,
    hasFFmpeg,
    hasFFprobe,
  };

  if (!FFMPEG_STATUS.enabled) {
    console.warn(
      LOG_COLOR.FG_YELLOW +
        "[Warning]" +
        LOG_COLOR.RESET +
        "FFmpeg未正确安装，某些功能将无法使用。请参考文档进行安装:",
      FFMPEG_STATUS
    );
  } else {
    console.log(
      LOG_COLOR.FG_GREEN + "[Info]"  , "FFmpeg已安装"+ LOG_COLOR.RESET
    );
  }
  global.HAS_FFMPEG = FFMPEG_STATUS.enabled;
  return FFMPEG_STATUS;
};

const checkConfig = async () => {
  const envOk = checkEnvConfig();
  const ffmpegOk = await checkFFmpeg();
  if (!envOk) {
    throw new Error("配置检查未通过，服务器启动中止。");
  }
};

export default checkConfig;
