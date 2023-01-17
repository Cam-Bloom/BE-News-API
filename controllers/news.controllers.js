const {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  updateArticleVotes,
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

  Promise.all([fetchCommentsByArticleId(id), fetchArticleById(id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function patchArticleVotes(req, res, next) {
  const { article_id: id } = req.params;
  const { body } = req;
  console.log(body);
  updateArticleVotes(id, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleVotes,
};
