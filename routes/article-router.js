const express = require("express");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchArticleVotes,
} = require("../controllers/news.controllers");

const articleRouter = express.Router();

articleRouter.get("/", getArticles);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articleRouter;
