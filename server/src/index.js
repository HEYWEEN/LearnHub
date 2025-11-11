const express = require('express');
const app = express();
const port = 5000;

const routes = require('./routes'); // 自动加载 index.js

// 将 auth 路由挂载到 /auth 路径下
app.use('/auth', routes.auth);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});
