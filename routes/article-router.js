const express = require("express");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchArticleVotes,
  postNewArticle,
  deleteArticleByArticleId,
} = require("../controllers/news.controllers");

const articleRouter = express.Router();

articleRouter.route("/").get(getArticles).post(postNewArticle);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes)
  .delete(deleteArticleByArticleId);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articleRouter;
