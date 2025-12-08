# 依赖安装

Node.js, npm, MySQL, ffmpeg

```bash
cd server
npm install
```

- **关于ffmpeg**

需要在系统中安装 `ffmpeg`，例如在 Ubuntu 上
```bash
sudo apt update && sudo apt install -y ffmpeg
```
如果没有在环境里安装ffmpeg

那么数据库在上传课程视频时不会填充视频时长字段并且无法启用hls

# 运行前配置

**运行刚需mysql，并请准备好账号和密码**

1. 初始化数据库

运行scipts/initDatabase.sql

2. 配置config

    复制一份.env.example并改名为.env文件，并进行以下修改：

- DB_USER、DB_PASSWORD：mysql账号和密码

- API_KEY、AI_URL：如果要开启/api/ai下的所有功能需要准备一个api密钥，和对应接口网站

- SECRET_KEY：为了安全性考虑，建议给SECERT_KEY设置一个较复杂的字符串

    可以参考.env.example
```bash
PORT=4004 #后端端口号
DB_HOST=localhost
DB_USER=admin_user #数据库账号名
DB_PASSWORD=123456 #数据库账号密码
DB_NAME=learnhub
SECRET_KEY= #用于jwt的公钥
AI_URL=https://api.deepseek.com/v1
API_KEY=
AI_MODEL=deepseek-chat
DETAILED_LOGGING=false #改为true开启详细log
```

3. 导入测试数据(可选)

运行``npm run db:test``

注：这个指令不会自动导入图片和视频，如需显示请在/server/uploads文件夹下填充以下几个文件

- 图片： testImg01.jpg ~ testImg06.jpg

- 视频： testVideo01.mp4 ~ testVideo.mp4

# 运行
```bash
# 开发模式
npm start
# 或直接
node src/index.js
```
# 测试
```bash
npm test
```
这个指令会打开一个测试界面

需同时运行``npm start``或``node src/index.js``才能使用