const express = require("express");
const usersRouter = express.Router();
const {
  getUsers,
  getUserByUsername,
  postUser,
} = require("../controllers/news.controllers");

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter.get("/:username", getUserByUsername);

//post
//delete

module.exports = usersRouter;
