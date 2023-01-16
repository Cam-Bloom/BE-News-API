const { fetchAllTopics, fetchAllArticles } = require("../models/news.models");

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

module.exports = { getTopics, getArticles };
