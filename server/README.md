# 依赖安装
```
npm install
```

# 运行前配置

**运行刚需mysql，并请准备好账号和密码**

1. 初始化数据库

运行initDatabase.sql

2. 导入测试数据(可选)
运行/test/testData.sql

3. 配置config

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

# 运行
```
npm start
```
或
```
node src/index.js
```