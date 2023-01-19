const express = require("express");
const topicsRouter = express.Router();
const {
  getTopics,
  getTopicsBySlug,
} = require("../controllers/news.controllers");

topicsRouter.get("/", getTopics);

topicsRouter.get("/:slug", getTopicsBySlug);

module.exports = topicsRouter;
