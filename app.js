const express = require('express');
const mongoose = require('mongoose');

const app = express();

const usersRouter = require('./routes/users');

const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017diplomdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.listen(3000);