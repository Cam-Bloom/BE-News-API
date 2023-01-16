const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/news.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

// ERROR HANDLING
// POSTGRES ERROR
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

//CUSTOM ERROR HANDLER
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// INTERNAL SEVER ERROR
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

// CATCH BAD REQUEST
app.all("*", (req, res) => {
  app.status(404).send({ msg: "Bad Request" });
});
module.exports = app;
