const express = require("express");
const { getDesc } = require("./controllers/news.controllers");
const {
  postgresErr,
  customErr,
  internalErr,
  catchAll,
} = require("./errorHandlers");
const {
  articleRouter,
  topicsRouter,
  usersRouter,
  commentsRouter,
} = require("./routes/index");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors()); 
app.get("/api", getDesc);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articleRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

// CATCH BAD REQUEST
app.all("*", catchAll);

// ERROR HANDLING

app.use(postgresErr);
app.use(customErr);
app.use(internalErr);

module.exports = app;
