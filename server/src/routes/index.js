const authRouter = require('./authRoutes');
const coursesRouter = require('./coursesRoutes');
const learningRouter = require('./learningRoutes');
const usersRouter = require('./usersRoutes');
const aiRouter = require('./aiRoutes');

module.exports = {
    aiRouter: aiRouter,
    authRouter: authRouter,
    coursesRouter:coursesRouter,
    learningRouter:learningRouter,
    usersRouter:usersRouter
};
