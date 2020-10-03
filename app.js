const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017diplomdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

app.listen(3000);