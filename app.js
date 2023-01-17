const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
} = require("./controllers/news.controllers");
const { postgresErr, customErr, internalErr } = require("./errorHandlers");

const app = express();

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

// ERROR HANDLING

app.use(postgresErr);
app.use(customErr);
app.use(internalErr);

// CATCH BAD REQUEST
app.all("*", (req, res) => {
  app.status(404).send({ msg: "Bad Request" });
});

module.exports = app;
