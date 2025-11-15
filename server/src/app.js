//src/app.js
import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();

app.use(express.json());

import routes from './routes/index.js';
import errorHandler from './middleware/errorMiddleware.js';      

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