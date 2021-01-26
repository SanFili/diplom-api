require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');

const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();

const whitelist = [
  'http://www.api.news.diplom.students.nomoreparties.space',
  'http://api.news.diplom.students.nomoreparties.space',
  'http://www.news.diplom.students.nomoreparties.space',
  'http://news.diplom.students.nomoreparties.space',
  'https://www.api.news.diplom.students.nomoreparties.space',
  'https://api.news.diplom.students.nomoreparties.space',
  'https://www.news.diplom.students.nomoreparties.space',
  'https://news.diplom.students.nomoreparties.space',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'origin',
    'x-access-token',
    'authorization',
    'credentials',
  ],
  credentials: true,
};

app.use(bodyParser.json());

app.use(requestLogger);

app.use(cors(corsOptions));

app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser);


app.use('/users', auth, usersRouter);
app.use('/articles', auth, articlesRouter);
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка на сервере' : message,
  });
});

app.listen(PORT);
