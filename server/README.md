# 依赖安装

Node.js, npm, MySQL, ffmpeg（用于 HLS 生成）（可选）

```bash
cd server
npm install
```
- **ffmpeg（可选）**: 如果要启用 HLS 生成，需要在系统中安装 `ffmpeg`，例如在 Ubuntu 上：

```bash
sudo apt update && sudo apt install -y ffmpeg
```
# 运行前配置

**运行刚需mysql，并请准备好账号和密码**

1. 初始化数据库

运行initDatabase.sql

2. 配置config

    在/.env文件中修改：

- mysql账号和密码

- 如果要开启/api/ai下的所有功能需要准备一个api密钥

- 为了安全性考虑，建议给SECERT_KEY设置一个较复杂的字符串

    可以参考.env.example
```
DB_HOST=localhost
DB_USER=admin_user
DB_PASS=123456
DB_NAME=learnhub
SECRET_KEY=your_key
DEEPSEEK_API_KEY=your_api
```

3. 导入测试数据(可选)

运行``npm run db:test``

# 运行
```bash
# 开发模式
npm start
# 或直接
node src/index.js
```



视频流（Range）与 HLS 使用
------------------------

后端支持两类视频访问方式：直接的字节范围（HTTP Range）流式传输，以及可选的 HLS（m3u8 + ts 段）生成。

- 字节范围流（适用于直接播放 MP4）
  - 路径示例：`GET /uploads/{path_to_video}.mp4`（由静态文件中间件托管）
  - 客户端播放器会发起 `Range` 请求。也可以使用 curl 测试部分内容：

```bash
# 请求文件的前 1KB
curl -H "Range: bytes=0-1023" \
  -H "Authorization: Bearer $TOKEN" \
  -v http://localhost:3000/uploads/path/to/video.mp4 --output - | head -c 200 > part.bin
```

  - 服务器会返回 `206 Partial Content` 与 `Content-Range`，播放器将根据返回流式播放。

- HLS（可选）
  - API 设计示例（可由后端提供触发 HLS 生成的接口）：
    - `POST /api/courses/:courseId/lesson/:lessonId/hls` —— 触发将课时视频转为 HLS（m3u8 + ts 段）。
  - 生成成功后，HLS 文件通常写在 `uploads/hls/{courseId}/{lessonId}/index.m3u8`，播放地址例如：

```
http://localhost:3000/uploads/hls/{courseId}/{lessonId}/index.m3u8
```

  - 使用浏览器或 HLS 支持的播放器（如 hls.js）播放该 m3u8 即可。
  - 注意：HLS 生成需要 `ffmpeg` 可用；生成过程可能较慢且占用资源，建议在生产环境中使用后台任务/队列（例如 Bull + Redis）异步处理。


静态文件访问说明
----------------

- 所有上传的静态文件（图片、原始视频、HLS 输出等）默认保存在项目根目录下的 `uploads/` 目录，服务会将 `uploads` 目录作为静态文件目录对外暴露。
- 访问示例：`http://localhost:3000/uploads/{filename}`。

