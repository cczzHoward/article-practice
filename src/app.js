const express = require('express');
const app = express();

const ArticleRouter = require('./routes/article');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.use('/api/articles', ArticleRouter);

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});