const express = require("express");
const commentsRouter = express.Router();
const {
  deleteCommentByCommentId,
  patchCommentVotes,
} = require("../controllers/news.controllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentByCommentId)
  .patch(patchCommentVotes);

module.exports = commentsRouter;
