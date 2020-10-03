const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');
const urlValid = require('../regexp/urlValidation');

articlesRouter.get('/', getArticles);
articlesRouter.post('/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().regex(urlValid),
      image: Joi.string().required().regex(urlValid),
    }),
  }),
  createArticle);
articlesRouter.delete('/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  deleteArticle);

module.exports = articlesRouter;
