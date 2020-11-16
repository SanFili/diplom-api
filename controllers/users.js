require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const AuthError = require('../errors/auth-err');
const ConflictError = require('../errors/conflict-err');

module.exports.getUser = ( req, res, next ) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name })
      .then(() => res.status(200).send({ message: 'Вы успешно зарегестрированы!' }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Переданы невалидные данные'));
        } else {
          next(new ConflictError('Такой пользователь уже зарегистрирован'));
        }
      }))
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'prod' ? process.env.JWT_SECRET : 'some-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.status(200).send({ message: 'Аутентификация прошла успешно' });
    })
    .catch((err) => {
      next(new AuthError(err.message));
    });
};
