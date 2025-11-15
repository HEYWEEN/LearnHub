const app = require('./app.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Express server listening at http://localhost:${PORT}`);
});





