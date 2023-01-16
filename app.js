const express = require("express");
const { getTopics, getArticleById } = require("./controllers/news.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

// ERROR HANDLING

// INTERNAL SEVER ERROR
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
