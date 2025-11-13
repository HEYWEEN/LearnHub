const express = require('express');
//const connectDB = require('./config/db');
const app = express();
const port = process.env.port||5000;

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

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});
