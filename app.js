const express = require("express");
const { getTopics, getArticles } = require("./controllers/news.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

// ERROR HANDLING

// INTERNAL SEVER ERROR
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

// CATCH BAD REQUEST
app.all("*", (req, res) => {
  app.status(404).send({ msg: "Bad Request" });
});
module.exports = app;
