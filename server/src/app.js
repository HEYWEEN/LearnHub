const express = require('express');
//const connectDB = require('./config/db');
const app = express();
const dotenv = require('dotenv');
dotenv.config();


app.use(express.json());

//connectDB();

const routes = require('./routes');

app.use('/api/auth'     , routes.authRouter);
app.use('/api/learning' , routes.learningRouter);
app.use('/api/courses'  , routes.coursesRouter);
app.use('/api/users'    , routes.usersRouter);
app.use('/api/ai'       , routes.aiRouter);

app.get('/', (req, res) => {
    res.send('LearnHub API is running...');
});

module.exports = app;