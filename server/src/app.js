//src/app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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