const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/users');

usersRouter.get('/', getUsers);

module.exports = usersRouter;