const express = require("express");
const usersRouter = express.Router();
const { getUsers } = require("../controllers/news.controllers");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
