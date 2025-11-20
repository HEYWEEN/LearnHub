//src/app.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

connectDB();

import checkConfig from './utils/configChecker.js';
checkConfig();

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

app.use(loggerMiddleware);

app.use('/api/auth'     , routes.authRouter);
app.use('/api/learning' , routes.learningRouter);
app.use('/api/courses'  , routes.coursesRouter);
app.use('/api/users'    , routes.usersRouter);
app.use('/api/ai'       , routes.aiRouter);

app.get('/', (req, res) => {
    res.send('LearnHub API is running...');
});

app.use(errorHandler);

export default app;