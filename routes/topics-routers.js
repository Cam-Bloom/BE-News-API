const express = require("express");
const topicsRouter = express.Router();
const {
  getTopics,
  getTopicsBySlug,
  postTopic,
} = require("../controllers/news.controllers");

topicsRouter.route("/").get(getTopics).post(postTopic);

topicsRouter.get("/:slug", getTopicsBySlug);

//delete
//patch

module.exports = topicsRouter;
