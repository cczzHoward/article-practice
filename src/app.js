const express = require('express');
const app = express();
require('dotenv').config();

const loggerMiddleware = require('./middlewares/logger');
const responseUtils = require('./utils/response');

const ArticleRouter = require('./routes/article');
const AuthRouter = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware.logRequest);

app.get('/', (req, res) => {
  responseUtils.success(res, null, 'Root endpoint is working!');
});

app.get('/api', (req, res) => {
  responseUtils.success(res, null, 'API is working!');
});

app.use('/api/v1/users', AuthRouter);
app.use('/api/v1/articles', ArticleRouter);

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});