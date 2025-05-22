const express = require('express');
const app = express();
require('dotenv').config();

const ArticleRouter = require('./routes/article');
const UserRouter = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.use('/api/v1/users', UserRouter);
app.use('/api/v1/articles', ArticleRouter);

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});