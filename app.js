const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/news.controllers");
const { postgresErr, customErr, internalErr } = require("./errorHandlers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

// ERROR HANDLING

app.use(postgresErr);
app.use(customErr);
app.use(internalErr);

// CATCH BAD REQUEST
app.all("*", (req, res) => {
  app.status(404).send({ msg: "Bad Request" });
});

module.exports = app;
