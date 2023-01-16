const express = require("express");
const { getTopics } = require("./controllers/news.controllers");

const app = express();

app.get("/api/topics", getTopics);

// ERROR HANDLING

// INTERNAL SEVER ERROR
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
