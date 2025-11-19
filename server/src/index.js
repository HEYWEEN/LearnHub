import app from './app.js';
import LOG_COLOR from './constants/logColor.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(LOG_COLOR.FG_BLUE + `LearnHub API is listening at http://localhost:${PORT}` + LOG_COLOR.RESET);
});





