//src/app.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

await connectDB();

import checkConfig from './utils/configChecker.js';
checkConfig();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

import routes from './routes/index.js';
import errorHandler from './middleware/errorMiddleware.js';
import loggerMiddleware from './middleware/loggerMiddleware.js';      
import notFound from './middleware/notFoundMiddleware.js';

app.use(loggerMiddleware);

app.use('/api/auth'     , routes.authRouter);
app.use('/api/learning' , routes.learningRouter);
app.use('/api/courses'  , routes.coursesRouter);
app.use('/api/users'    , routes.usersRouter);
app.use('/api/ai'       , routes.aiRouter);
app.use('/api/note'     , routes.noteRouter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('LearnHub API is running...');
});

app.use(notFound);
app.use(errorHandler);

export default app;