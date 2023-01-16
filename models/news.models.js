const db = require("../db/connection");

function fetchAllTopics() {
  const sqlQuery = `SELECT * FROM topics`;

  return db.query(sqlQuery).then(({ rows: topics }) => {
    return topics;
  });
}

function fetchArticleById(id) {
  const sqlQuery = `
  SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
  FROM articles
  WHERE article_id = $1
  `;
}

module.exports = { fetchAllTopics, fetchArticleById };
