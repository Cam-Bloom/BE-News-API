const {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
  createComment,
} = require("../models/news.models");

function getTopics(req, res, next) {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
}

function getArticles(req, res, next) {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
}

function getArticleById(req, res, next) {
  const { article_id: id } = req.params;

  fetchArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
}

function postComment(req, res, next) {
  const { article_id: id } = req.params;
  const { body } = req;

  createComment(id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

module.exports = { getTopics, getArticles, getArticleById, postComment };
