<<<<<<< HEAD
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
=======
import app from './app.js';
import LOG_COLOR from './constants/logColor.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(LOG_COLOR.FG_BLUE + `LearnHub API is listening at http://localhost:${PORT}` + LOG_COLOR.RESET);
});





>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
