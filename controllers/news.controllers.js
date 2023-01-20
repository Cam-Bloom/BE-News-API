const {
  fetchDesc,
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  createComment,
  updateArticleVotes,
  fetchAllUsers,
  removeCommentById,
  fetchUserByUsername,
  updateCommentVotes,
  createNewArticle,
  fetchTopicBySlug,
  createNewTopic,
} = require("../models/news.models");

function getDesc(req, res, next) {
  fetchDesc()
    .then((desc) => {
      res.status(200).send(desc);
    })
    .catch(next);
}

function getTopics(req, res, next) {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const { query } = req;
  const totalQueryCopy = { ...query };
  totalQueryCopy.total = true;

  Promise.all([fetchAllArticles(query), fetchAllArticles(totalQueryCopy)])
    .then(([articles, totalArticles]) => {
      const total_count = totalArticles.length - articles.length;

      res.status(200).send({ articles, total_count });
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
  const { query } = req;

  Promise.all([fetchCommentsByArticleId(id, query), fetchArticleById(id)])
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

function deleteCommentByCommentId(req, res, next) {
  const { comment_id: id } = req.params;

  removeCommentById(id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
}

function getUserByUsername(req, res, next) {
  const { username } = req.params;

  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function patchCommentVotes(req, res, next) {
  const { comment_id: id } = req.params;
  const { body } = req;

  updateCommentVotes(id, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
}

function postNewArticle(req, res, next) {
  const { body } = req;

  Promise.all([createNewArticle(body), fetchTopicBySlug(body.topic)])
    .then(([article]) => {
      return article.article_id;
    })
    .then((id) => {
      return fetchArticleById(id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
}

function getTopicsBySlug(req, res, next) {
  const { slug } = req.params;

  fetchTopicBySlug(slug)
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
}

function postTopic(req, res, next) {
  const { body } = req;

  createNewTopic(body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
}

module.exports = {
  getDesc,
  getTopics,
  getArticles,
  getArticleById,
  postComment,
  getCommentsByArticleId,
  patchArticleVotes,
  getUsers,
  deleteCommentByCommentId,
  getUserByUsername,
  patchCommentVotes,
  postNewArticle,
  getTopicsBySlug,
  postTopic,
};
