const {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  createComment,
  updateArticleVotes,
  fetchAllUsers,
} = require("../models/news.models");

function getTopics(req, res, next) {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const { query } = req;
  fetchAllArticles(query)
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

function postComment(req, res, next) {
  const { article_id: id } = req.params;
  const { body } = req;

  createComment(id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

function patchArticleVotes(req, res, next) {
  const { article_id: id } = req.params;
  const { body } = req;

  Promise.all([updateArticleVotes(id, body), fetchArticleById(id)])
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getUsers(req, res, next) {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  postComment,
  getCommentsByArticleId,
  patchArticleVotes,
  getUsers,
};
