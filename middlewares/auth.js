const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (req.headers.cookie) {
    const cookieToken = req.headers.cookie.replace('jwt=', '');
    let payload;
    try {
      payload = jwt.verify(cookieToken, process.env.NODE_ENV === 'prod' ? process.env.JWT_SECRET : 'some-key');
    } catch (err) {
      next(new AuthError('Необходима авторизация'));
    }
    req.user = payload;
  } else {
    next(new AuthError('Необходима авторизация'));
  }
  next();
};
