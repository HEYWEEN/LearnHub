//src/app.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

await connectDB();

import checkConfig from './utils/configChecker.js';

await checkConfig();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use((req, res, next) => {
  // 允许所有域（仅开发环境）
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  // 处理 OPTIONS 预检
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());

import routes from './routes/index.js';
import errorHandler from './middleware/errorMiddleware.js';
import loggerMiddleware from './middleware/loggerMiddleware.js';      
import notFound from './middleware/notFoundMiddleware.js';

app.use(loggerMiddleware);

app.use('/api/auth'     , routes.authRouter    );
app.use('/api/learning' , routes.learningRouter);
app.use('/api/courses'  , routes.coursesRouter );
app.use('/api/users'    , routes.usersRouter   );
app.use('/api/ai'       , routes.aiRouter      );
app.use('/api/note'     , routes.noteRouter    );
app.use('/api/teacher'  , routes.teacherRouter );

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.send('LearnHub API is running...');
});

app.use(notFound);
app.use(errorHandler);

export default app;