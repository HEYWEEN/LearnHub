
import express from 'express';
const app = express();
const port = 5000;

app.use(express.static('scripts/unit/public')); // 设置静态文件目录

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});