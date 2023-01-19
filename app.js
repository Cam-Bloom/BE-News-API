const express = require("express");
const {
  getDesc,
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchArticleVotes,
  getUsers,
} = require("./controllers/news.controllers");
const { postgresErr, customErr, internalErr } = require("./errorHandlers");

const app = express();

app.use(express.json());
app.get("/api", getDesc);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.get("/api/users", getUsers);

// ERROR HANDLING

app.use(postgresErr);
app.use(customErr);
app.use(internalErr);

// CATCH BAD REQUEST
app.all("*", (req, res) => {
  app.status(404).send({ msg: "Bad Request" });
});

module.exports = app;
