const {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
} = require("../models/news.models");

function getTopics(req, res, next) {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticleById(req, res, next) {
  const { article_id: id } = req.params;

  fetchArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getCommentsByArticleId(req, res, next) {
  const { article_id: id } = req.params;
  fetchCommentsByArticleId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
};
