const express = require("express");
const commentsRouter = express.Router();
const { deleteCommentByCommentId } = require("../controllers/news.controllers");

commentsRouter.delete("/:comment_id", deleteCommentByCommentId);

module.exports = commentsRouter;
