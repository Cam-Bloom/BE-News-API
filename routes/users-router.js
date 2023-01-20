const express = require("express");
const usersRouter = express.Router();
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/news.controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByUsername);

//post
//delete
//query LIKE

module.exports = usersRouter;
