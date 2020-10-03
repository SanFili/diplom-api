const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send({ data: articles }))
    .catch((err) => next(err));
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;

  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .orFail()
    .then((article) => {
      if (article.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.id)
          .then((foundArticle) => {
            if (foundArticle !== null) {
              res.status(200).send({ data: foundArticle });
            } else {
              next(new NotFoundError('Статья не найдена'));
            }
          })
          .catch((err) => next(err));
      } else {
        next(new ForbiddenError('К сожалению, Вы не можете удалить данную статью'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Статья не найдена'));
      } else {
        next(err);
      }
    });
};
