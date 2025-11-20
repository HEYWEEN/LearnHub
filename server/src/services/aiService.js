import OpenAI from "openai";
import LOG_COLOR from "../constants/logColor.js";

async function chatWithAi(messages, think = false) {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error(
      LOG_COLOR.FG_RED + "[err] 未设置API_KEY,无法开启ai功能" + LOG_COLOR.RESET
    );
    return undefined;
  }
  const model = {
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
    name: think ? "deepseek-reasoner" : "deepseek-chat",
  };
  const openai = new OpenAI({
    baseURL: model.baseURL,
    apiKey: model.apiKey,
  });
  const completion = await openai.chat.completions.create({
    messages,
    model: model.name,
  });
  return completion.choices[0].message.content;
}

export {chatWithAi};
