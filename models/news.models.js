const db = require("../db/connection");
const { queryFormat } = require("./utils.models");

function fetchAllTopics() {
  const sqlQuery = `SELECT * FROM topics`;

  return db.query(sqlQuery).then(({ rows: topics }) => {
    return topics;
  });
}

function fetchAllArticles(query) {
  let sqlQuery = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    USING (article_id)`;

  const { valueArr, sqlString, validationErr } = queryFormat(query);

  if (validationErr) return validationErr;
  if (sqlString) sqlQuery += sqlString;

  return db.query(sqlQuery, valueArr).then(({ rows: articles, rowCount }) => {
    return rowCount === 0
      ? Promise.reject({ status: 404, msg: "Not Found" })
      : articles;
  });
}

function fetchArticleById(id) {
  const sqlQuery = `
  SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments
  USING (article_id)
  WHERE article_id = $1
  GROUP BY 1,2,3,4,5,6,7
  `;

  return db.query(sqlQuery, [id]).then(({ rows: [article] }) => {
    return article
      ? article
      : Promise.reject({ status: 404, msg: "Not Found" });
  });
}

function fetchCommentsByArticleId(id) {
  const sqlQuery = `
  SELECT * 
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;
  `;
  return db.query(sqlQuery, [id]).then(({ rows: comments, rowCount }) => {
    return comments;
  });
}

function createComment(id, body) {
  if (body.body && body.username) {
    const inputValues = [body.body, body.username, id];

    const sqlQuery = `
    INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;

    return db.query(sqlQuery, inputValues).then(({ rows: [comment] }) => {
      return comment;
    });
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
}

function updateArticleVotes(id, { inc_votes }) {
  const valueArr = [inc_votes, id];

  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`;

  return db.query(sqlQuery, valueArr).then(({ rows: [updatedArticle] }) => {
    return updatedArticle;
  });
}

function fetchAllUsers() {
  const sqlQuery = `
  SELECT * 
  FROM users`;

  return db.query(sqlQuery).then(({ rows: users }) => {
    return users;
  });
}

function removeCommentById(id) {
  const sqlQuery = `
  DELETE FROM comments
  WHERE comment_id = $1`;

  return db.query(sqlQuery, [id]).then(({ rowCount }) => {
    if (rowCount === 0)
      return Promise.reject({ status: 404, msg: "Not Found" });
  });
}

module.exports = {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  createComment,
  updateArticleVotes,
  fetchAllUsers,
  removeCommentById,
};
